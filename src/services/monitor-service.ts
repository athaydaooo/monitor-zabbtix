import { IZabbixApiClient } from "@clients/zabbix-api/i-zabbix-api-client";
import { MikrotikService } from "./mikrotik-service";
import { ZabbixService } from "./zabbix-service";
import config from "@config/index";
import logger from "@utils/logger";
import { MIKROTIK_SERVICE_GETLAN_ERROR } from "@errors/mikrotik-api";
import getLanInfoFromSheet from "@utils/get-lan-info-from-sheet";

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
      const lansData = await getLanInfoFromSheet();

      const updateAllLans = hosts.map(async (host) => {
        try {
          const mikrotikService = new MikrotikService(
            host.interfaces[0].ip,
            config.mikrotikLanUsername,
            config.mikrotikLanPassword
          );
          const lan = await mikrotikService.getLan(host.host);

          const lanData = lansData.find((c) => c.host === host.host);

          if (!!lanData) await this.zabbixService.addLanData(lanData);

          await this.zabbixService.addLan(host.host, lan);
          await this.zabbixService.send(host.host);
        } catch (error) {
          if (error === MIKROTIK_SERVICE_GETLAN_ERROR) {
            const lanData = lansData.find((c) => c.host === host.host);
            if (!!lanData) await this.zabbixService.addLanData(lanData);
            await this.zabbixService.send(host.host);
          }

          logger.error(`Error trying to updateLan ${host.host}`, error);
        }
      });

      await Promise.allSettled(updateAllLans);
    } catch (error) {
      logger.error(`Error trying to updateAllLan`, error);
    }
  }

  async updateL2TPServer(): Promise<void> {
    try {
      const hosts = await this.zabbixApiClient.getHosts(
        config.l2tpServerHostGroupId
      );

      const updateAllL2TPServers = hosts.map(async (host) => {
        try {
          const mikrotikService = new MikrotikService(
            host.interfaces[0].ip,
            config.mikrotikUsername,
            config.mikrotikPassword,
            5580
          );

          const l2tpServer = await mikrotikService.getL2TPServer(host.host);
          await this.zabbixService.addL2TPServer(host.host, l2tpServer);
          await this.zabbixService.send(host.host);
        } catch (error) {
          logger.error(`Error trying to updateL2TPServer ${host.host}`, error);
        }
      });

      await Promise.allSettled(updateAllL2TPServers);
    } catch (error) {
      logger.error(`Error trying to updateL2TPServers`, error);
    }
  }
}
