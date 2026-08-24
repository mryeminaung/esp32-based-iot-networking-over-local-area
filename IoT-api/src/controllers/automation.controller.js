import {
  listRules,
  getRule,
  createRule,
  updateRule,
  deleteRule,
} from "../services/automation.service.js";
import { createActivityLog } from "../services/activity.service.js";

/**
 * GET /api/automation/rules
 */
export async function listRulesHandler(req, res) {
  try {
    const rules = await listRules();
    return res.json({ success: true, data: { rules } });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to fetch rules",
    });
  }
}

/**
 * GET /api/automation/rules/:id
 */
export async function getRuleHandler(req, res) {
  try {
    const rule = await getRule(Number(req.params.id));
    return res.json({ success: true, data: { rule } });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to fetch rule",
    });
  }
}

/**
 * POST /api/automation/rules
 */
export async function createRuleHandler(req, res) {
  try {
    const rule = await createRule(req.body);
    await createActivityLog(req.user?.id, "automation", `Created rule: ${rule.name}`);
    return res.status(201).json({
      success: true,
      message: "Rule created",
      data: { rule },
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to create rule",
    });
  }
}

/**
 * PATCH /api/automation/rules/:id
 */
export async function updateRuleHandler(req, res) {
  try {
    const rule = await updateRule(Number(req.params.id), req.body);
    const changes = Object.keys(req.body).join(", ");
    await createActivityLog(req.user?.id, "automation", `Updated rule: ${rule.name} (${changes})`);
    return res.json({
      success: true,
      message: "Rule updated",
      data: { rule },
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to update rule",
    });
  }
}

/**
 * DELETE /api/automation/rules/:id
 */
export async function deleteRuleHandler(req, res) {
  try {
    const rule = await getRule(Number(req.params.id));
    await deleteRule(rule.id);
    await createActivityLog(req.user?.id, "automation", `Deleted rule: ${rule.name}`);
    return res.json({ success: true, message: "Rule deleted" });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to delete rule",
    });
  }
}
