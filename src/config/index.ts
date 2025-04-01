import * as dotenv from "dotenv";

import path from "path";

const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

const config = {
  zabbixApiUrl: process.env.ZABBIX_API_URL || "",
  zabbixApiUsername: process.env.ZABBIX_API_USERNAME || "",
  zabbixApiPassword: process.env.ZABBIX_API_PASSWORD || "",
  zabbixServerPort: Number(process.env.ZABBIX_SERVER_PORT) || 0,
  zabbixServer: process.env.ZABBIX_SERVER || "",
  mikrotikUsername: process.env.MIKROTIK_USERNAME || "",
  mikrotikPassword: process.env.MIKROTIK_PASSWORD || "",
  mikrotikLanUsername: process.env.MIKROTIK_LAN_USERNAME || "",
  mikrotikLanPassword: process.env.MIKROTIK_LAN_PASSWORD || "",
  healthCheckServer: process.env.HEALTH_CHECK_SERVER || "",
  lanHostGroupId: process.env.LAN_HOST_GROUP_ID || "",
  l2tpServerHostGroupId: process.env.L2TP_SERVER_HOST_GROUP_ID || "",
};

export default config;
