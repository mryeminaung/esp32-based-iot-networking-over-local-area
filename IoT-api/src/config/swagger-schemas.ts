export const components = {
  securitySchemes: {
    BearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description: "JWT access token from /api/auth/login",
    },
  },
  schemas: {
    User: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        email: { type: "string", format: "email", example: "admin@farm.com" },
        name: { type: "string", nullable: true, example: "John Doe" },
        image: { type: "string", nullable: true },
        role: {
          type: "string",
          enum: ["farm_manager", "farm_worker", "technician"],
          example: "farm_manager",
        },
        createdAt: { type: "string", format: "date-time" },
      },
    },
    SensorReading: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        deviceId: { type: "integer", example: 1 },
        temperature: { type: "number", format: "float", nullable: true, example: 28.5 },
        humidity: { type: "number", format: "float", nullable: true, example: 65.2 },
        soilMoisture: { type: "number", format: "float", nullable: true, example: 45.0 },
        light: { type: "number", format: "float", nullable: true, example: 72.0 },
        airQuality: { type: "number", format: "float", nullable: true, example: 35.0 },
        waterLevel: { type: "number", format: "float", nullable: true, example: 60.0 },
        createdAt: { type: "string", format: "date-time" },
      },
    },
    ActivityLog: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        userId: { type: "integer", nullable: true, example: 1 },
        user: { $ref: "#/components/schemas/User" },
        device: { type: "string", example: "water_pump" },
        action: { type: "string", example: "turned_on" },
        value: { type: "integer", nullable: true, example: 1 },
        createdAt: { type: "string", format: "date-time" },
      },
    },
    DeviceSettings: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        soilDryThreshold: { type: "number", example: 30 },
        soilOptimalThreshold: { type: "number", example: 50 },
        waterLowThreshold: { type: "number", example: 25 },
        waterCriticalThreshold: { type: "number", example: 10 },
        waterWarningEnabled: { type: "boolean", example: true },
        buzzerEnabled: { type: "boolean", example: true },
        buzzerLowWater: { type: "boolean", example: true },
        buzzerDrySoil: { type: "boolean", example: true },
        buzzerSensorError: { type: "boolean", example: false },
        lightLowThreshold: { type: "integer", example: 30 },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
    SuccessResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string" },
      },
    },
    ErrorResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: false },
        message: { type: "string" },
      },
    },
    PaginatedResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            items: { type: "array", items: {} },
            total: { type: "integer" },
            page: { type: "integer" },
            limit: { type: "integer" },
            totalPages: { type: "integer" },
          },
        },
      },
    },
  },
};
