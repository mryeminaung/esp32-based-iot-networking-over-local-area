export const ROLES = {
	FARM_MANAGER: "farm_manager",
	FARM_WORKER: "farm_worker",
	TECHNICIAN: "technician",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
