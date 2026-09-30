import swaggerJsdoc from "swagger-jsdoc";
import { components } from "./swagger-schemas.js";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ESP32 Based IoT Networking Over Local Area API",
      version: "1.0.0",
      description:
        "REST API for ESP32-based Smart Agriculture IoT platform. " +
        "Manages sensors, actuators, users, automation rules, and activity logs.",
      contact: { name: "Smart Agriculture Team" },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}`,
        description: "Development server",
      },
    ],
    components,
    security: [{ BearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
