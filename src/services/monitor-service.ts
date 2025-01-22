import { IZabbixApiClient } from "@clients/zabbix-api/i-zabbix-api-client";
import { MikrotikService } from "./mikrotik-service";
import { ZabbixService } from "./zabbix-service";
import config from "@config/index";
import logger from "@utils/logger";

export class MonitorService {
  private zabbixApiClient: IZabbixApiClient;
  private zabbixService: ZabbixService;

  constructor(zabbixApiClient: IZabbixApiClient, zabbixService: ZabbixService) {
    this.zabbixApiClient = zabbixApiClient;
    this.zabbixService = zabbixService;
  }

  async updateLan(): Promise<void> {
    try {
      const hosts = await this.zabbixApiClient.getHosts(config.lanHostGroupId);

      const updateAllLans = hosts.map(async (host) => {
        try {
          const mikrotikService = new MikrotikService(host.interfaces[0].ip);
          const lan = await mikrotikService.getLan();
          await this.zabbixService.addLan(host.host, lan);
          await this.zabbixService.send(host.host);
        } catch (error) {
          logger.error(`Error trying to updateLan ${host.host}`, error);
        }
      });

      await Promise.allSettled(updateAllLans);
    } catch (error) {
      logger.error(`Error trying to updateAllLan`, error);
    }
  }
}
