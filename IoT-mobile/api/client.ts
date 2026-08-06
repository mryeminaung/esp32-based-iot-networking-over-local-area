import axios from "axios";
import Constants from "expo-constants";

// Get ESP32 IP from .env file
const extra = Constants.expoConfig?.extra ?? {};
const esp32_ip = extra.esp32ApiUrl ?? "192.168.1.100";

export const getEsp32Ip = () => esp32_ip;

const apiClient = axios.create({
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Dynamic base URL based on ESP32 IP from .env
export const getBaseUrl = () => esp32_ip;

export default apiClient;
