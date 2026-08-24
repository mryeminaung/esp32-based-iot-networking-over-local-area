import { backendClient } from "@/api/auth"
import type { AutomationRule, CreateRuleInput, UpdateRuleInput } from "../types"

type RulesResponse = {
  success: boolean
  data: { rules: AutomationRule[] }
}

type RuleResponse = {
  success: boolean
  data: { rule: AutomationRule }
}

export async function getRules(): Promise<AutomationRule[]> {
  const { data } = await backendClient.get<RulesResponse>("/automation/rules")
  return data.data.rules
}

export async function getRule(id: number): Promise<AutomationRule> {
  const { data } = await backendClient.get<RuleResponse>(`/automation/rules/${id}`)
  return data.data.rule
}

export async function createRule(input: CreateRuleInput): Promise<AutomationRule> {
  const { data } = await backendClient.post<RuleResponse>("/automation/rules", input)
  return data.data.rule
}

export async function updateRule(id: number, input: UpdateRuleInput): Promise<AutomationRule> {
  const { data } = await backendClient.patch<RuleResponse>(`/automation/rules/${id}`, input)
  return data.data.rule
}

export async function deleteRule(id: number): Promise<void> {
  await backendClient.delete(`/automation/rules/${id}`)
}
