import * as dotenv from "dotenv";

dotenv.config();

const config = {
  zabbixApiUrl: process.env.ZABBIX_API_URL || "",
  zabbixApiUsername: process.env.ZABBIX_API_USERNAME || "",
  zabbixApiPassword: process.env.ZABBIX_API_PASSWORD || "",
  zabbixServerPort: Number(process.env.ZABBIX_SERVER_PORT) || 0,
  zabbixServer: process.env.ZABBIX_SERVER || "",
  mikrotikLanUser: process.env.MIKROTIK_LAN_USER || "",
  mikrotikLanPassword: process.env.MIKROTIK_LAN_PASSWORD || "",
  healthCheckServer: process.env.HEALTH_CHECK_SERVER || "",
};

export default config;
