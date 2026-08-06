import apiClient, { getBaseUrl } from "./client";
import type { SystemInfo, Sensors, AllData, ControlResult } from "@/types";

export async function getSystemInfo(): Promise<SystemInfo> {
  const { data } = await apiClient.get<SystemInfo>(`${getBaseUrl()}/system`);
  return data;
}

export async function getSensors(): Promise<Sensors> {
  const { data } = await apiClient.get<Sensors>(`${getBaseUrl()}/sensors`);
  return data;
}

export async function getAll(): Promise<AllData> {
  const { data } = await apiClient.get<AllData>(`${getBaseUrl()}/all`);
  return data;
}

export async function controlDevice(
  device: string,
  state: number,
  value?: number,
): Promise<ControlResult> {
  const { data } = await apiClient.post<ControlResult>(`${getBaseUrl()}/control`, {
    device,
    state,
    value: value ?? 0,
  });
  return data;
}

export async function testConnection(): Promise<boolean> {
  try {
    await apiClient.get(`${getBaseUrl()}/system`);
    return true;
  } catch {
    return false;
  }
}
