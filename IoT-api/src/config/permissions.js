export const ROLES = {
  FARM_MANAGER: "farm_manager",
  FARM_WORKER: "farm_worker",
  TECHNICIAN: "technician",
};

// Permission constants
export const P = {
  USERS_READ: "users:read",
  USERS_MANAGE: "users:manage",
  SENSORS_READ: "sensors:read",
  DEVICES_READ: "devices:read",
  DEVICES_CONTROL: "devices:control",
  AUTOMATION_CONFIGURE: "automation:configure",
  LOGS_READ: "logs:read",
  ACTIVITY_READ: "activity:read",
  NETWORK_READ: "network:read",
  DIAGNOSTICS_READ: "diagnostics:read",
  SYSTEM_CONFIGURE: "system:configure",
};

// Role → permissions mapping
export const PERMISSIONS = {
  [ROLES.FARM_MANAGER]: [
    P.USERS_READ,
    P.USERS_MANAGE,
    P.SENSORS_READ,
    P.DEVICES_READ,
    P.DEVICES_CONTROL,
    P.AUTOMATION_CONFIGURE,
    P.LOGS_READ,
    P.ACTIVITY_READ,
    P.NETWORK_READ,
    P.DIAGNOSTICS_READ,
    P.SYSTEM_CONFIGURE,
  ],
  [ROLES.FARM_WORKER]: [
    P.SENSORS_READ,
    P.DEVICES_READ,
    P.DEVICES_CONTROL,
    P.LOGS_READ,
    P.ACTIVITY_READ,
  ],
  [ROLES.TECHNICIAN]: [
    P.SENSORS_READ,
    P.DEVICES_READ,
    P.NETWORK_READ,
    P.DIAGNOSTICS_READ,
  ],
};

export const ROLE_LIST = Object.values(ROLES);

export const hasPermission = (role, permission) => {
  return PERMISSIONS[role]?.includes(permission) ?? false;
};
