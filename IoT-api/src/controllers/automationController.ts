import type { Request, Response } from "express";
import {
  listRules,
  getRule,
  createRule,
  updateRule,
  deleteRule,
} from "../services/automationService.js";
import { createActivityLog } from "../services/activityService.js";

/**
 * GET /api/automation/rules
 */
export async function listRulesHandler(req: Request, res: Response) {
  try {
    const rules = await listRules();
    return res.json({ success: true, data: { rules } });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch rules",
    });
  }
}

/**
 * GET /api/automation/rules/:id
 */
export async function getRuleHandler(req: Request, res: Response) {
  try {
    const rule = await getRule(Number(req.params.id));
    return res.json({ success: true, data: { rule } });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch rule",
    });
  }
}

/**
 * POST /api/automation/rules
 */
export async function createRuleHandler(req: Request, res: Response) {
  try {
    const rule = await createRule(req.body);
    await createActivityLog(req.user!.id, "automation", `Created rule: ${rule.name}`);
    return res.status(201).json({
      success: true,
      message: "Rule created",
      data: { rule },
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to create rule",
    });
  }
}

/**
 * PATCH /api/automation/rules/:id
 */
export async function updateRuleHandler(req: Request, res: Response) {
  try {
    const rule = await updateRule(Number(req.params.id), req.body);
    const changes = Object.keys(req.body).join(", ");
    await createActivityLog(req.user!.id, "automation", `Updated rule: ${rule.name} (${changes})`);
    return res.json({
      success: true,
      message: "Rule updated",
      data: { rule },
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to update rule",
    });
  }
}

/**
 * DELETE /api/automation/rules/:id
 */
export async function deleteRuleHandler(req: Request, res: Response) {
  try {
    const rule = await getRule(Number(req.params.id));
    await deleteRule(rule.id);
    await createActivityLog(req.user!.id, "automation", `Deleted rule: ${rule.name}`);
    return res.json({ success: true, message: "Rule deleted" });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to delete rule",
    });
  }
}
