import { prisma } from "../config/db.js";
import { createActivityLog } from "./activity.service.js";

const ESP32_API_URL = process.env.ESP32_API_URL || "http://192.168.4.1";

// --- CRUD ---

export async function listRules() {
  return prisma.automationRule.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getRule(id) {
  const rule = await prisma.automationRule.findUnique({ where: { id } });
  if (!rule) throw { status: 404, message: "Rule not found" };
  return rule;
}

export async function createRule(data) {
  return prisma.automationRule.create({ data });
}

export async function updateRule(id, data) {
  await getRule(id); // ensure exists
  return prisma.automationRule.update({ where: { id }, data });
}

export async function deleteRule(id) {
  await getRule(id); // ensure exists
  return prisma.automationRule.delete({ where: { id } });
}

// --- Evaluation Engine ---

/**
 * Evaluate all enabled automation rules against a sensor reading.
 * Called by the collector after each successful reading.
 */
export async function evaluateRules(reading) {
  const rules = await prisma.automationRule.findMany({
    where: { enabled: true },
  });

  const now = new Date();

  for (const rule of rules) {
    try {
      const value = reading[rule.sensor];
      if (value === null || value === undefined) continue;

      // Check cooldown
      if (rule.lastTriggered) {
        const elapsed = (now - rule.lastTriggered) / 1000;
        if (elapsed < rule.cooldown) continue;
      }

      // Check condition
      let triggered = false;
      switch (rule.condition) {
        case "below":
          triggered = value < rule.threshold;
          break;
        case "above":
          triggered = value > rule.threshold;
          break;
        case "equals":
          triggered = Math.abs(value - rule.threshold) < 0.01;
          break;
      }

      if (!triggered) continue;

      // Send command to ESP32
      const command = buildCommand(rule.action);
      if (command) {
        await sendCommand(command);
      }

      // Update lastTriggered
      await prisma.automationRule.update({
        where: { id: rule.id },
        data: { lastTriggered: now },
      });

      // Log the automation trigger (system event, no user)
      await createActivityLog(null, "automation", `${rule.name}: ${rule.action}`, Math.round(value));

      console.log(
        `[Automation] Triggered: ${rule.name} → ${rule.action} (${rule.sensor}=${value} ${rule.condition} ${rule.threshold})`
      );
    } catch (error) {
      console.error(`[Automation] Error evaluating rule "${rule.name}":`, error.message);
    }
  }
}

/**
 * Build ESP32 command from rule action
 */
function buildCommand(action) {
  switch (action) {
    case "pump_on":
      return { device: "water_pump", state: 1 };
    case "pump_off":
      return { device: "water_pump", state: 0 };
    case "led_on":
      return { device: "green_light", state: 1 };
    case "led_off":
      return { device: "green_light", state: 0 };
    default:
      return null;
  }
}

/**
 * Send a command to the ESP32
 */
async function sendCommand(command) {
  try {
    const res = await fetch(`${ESP32_API_URL}/control`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(command),
    });
    if (!res.ok) {
      console.error(`[Automation] ESP32 responded ${res.status}`);
    }
  } catch (error) {
    console.error(`[Automation] Failed to send command:`, error.message);
  }
}
