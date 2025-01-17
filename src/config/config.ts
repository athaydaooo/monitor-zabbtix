import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  zabbixApiUrl: process.env.ZABBIX_API_URL || "",
  zabbixServerPort: process.env.ZABBIX_SERVER_PORT || "",
  mikrotikUser: process.env.MIKROTIK_USER || "",
  mikrotikPass: process.env.MIKROTIK_PASS || "",
  zabbixServer: process.env.ZABBIX_SERVER || "",
};
