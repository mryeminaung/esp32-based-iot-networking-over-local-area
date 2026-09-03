import { AppError } from "../utils/appError.js";
import { prisma } from "../config/db.js";
import { createActivityLog } from "./activityService.js";

const ESP32_API_URL = process.env.ESP32_API_URL || "http://192.168.4.1";

interface RuleCreateData {
  name: string;
  sensor: string;
  condition: string;
  threshold: number;
  action: string;
  enabled?: boolean;
  duration?: number | null;
  cooldown?: number;
}

interface RuleUpdateData {
  name?: string;
  enabled?: boolean;
  sensor?: string;
  condition?: string;
  threshold?: number;
  action?: string;
  duration?: number | null;
  cooldown?: number;
}

interface SensorReading {
  temperature?: number | null;
  humidity?: number | null;
  soilMoisture?: number | null;
  light?: number | null;
  airQuality?: number | null;
  waterLevel?: number | null;
  [key: string]: number | null | undefined;
}

// --- CRUD ---

export async function listRules() {
  return prisma.automationRule.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getRule(id: number) {
  const rule = await prisma.automationRule.findUnique({ where: { id } });
  if (!rule) throw new AppError(404, "Rule not found");
  return rule;
}

export async function createRule(data: RuleCreateData) {
  return prisma.automationRule.create({ data });
}

export async function updateRule(id: number, data: RuleUpdateData) {
  await getRule(id);
  return prisma.automationRule.update({ where: { id }, data });
}

export async function deleteRule(id: number) {
  await getRule(id);
  return prisma.automationRule.delete({ where: { id } });
}

// --- Evaluation Engine ---

export async function evaluateRules(reading: SensorReading) {
  const rules = await prisma.automationRule.findMany({
    where: { enabled: true },
  });

  const now = new Date();

  for (const rule of rules) {
    try {
      const value = reading[rule.sensor];
      if (value === null || value === undefined) continue;

      if (rule.lastTriggered) {
        const elapsed = (now.getTime() - rule.lastTriggered.getTime()) / 1000;
        if (elapsed < rule.cooldown) continue;
      }

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

      const command = buildCommand(rule.action);
      if (command) {
        await sendCommand(command);
      }

      await prisma.automationRule.update({
        where: { id: rule.id },
        data: { lastTriggered: now },
      });

      await createActivityLog(null, "automation", `${rule.name}: ${rule.action}`, Math.round(value));

      console.log(
        `[Automation] Triggered: ${rule.name} → ${rule.action} (${rule.sensor}=${value} ${rule.condition} ${rule.threshold})`
      );
    } catch (error) {
      console.error(`[Automation] Error evaluating rule "${rule.name}":`, (error as Error).message);
    }
  }
}

function buildCommand(action: string): { device: string; state: number } | null {
  switch (action) {
    case "pump_on":
      return { device: "water_pump", state: 1 };
    case "pump_off":
      return { device: "water_pump", state: 0 };
    case "led_on":
      return { device: "green_light", state: 1 };
    case "led_off":
      return { device: "green_light", state: 0 };
    case "buzzer_on":
      return { device: "buzzer", state: 1 };
    case "buzzer_off":
      return { device: "buzzer", state: 0 };
    default:
      return null;
  }
}

async function sendCommand(command: { device: string; state: number }) {
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
    console.error(`[Automation] Failed to send command:`, (error as Error).message);
  }
}
