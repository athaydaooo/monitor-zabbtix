import { MikroTikClient } from "@clients/mikrotik/mikrotik-client";
import { IZabbixApiClient } from "@clients/zabbix-api/i-zabbix-api-client";
import { IZabbixSenderClient } from "@clients/zabbix-sender/zabbix-sender-client";
import config from "@config/index";
import logger from "@utils/logger";

export class MonitorService {
  private zabbixClient: IZabbixApiClient;
  private zabbixSender: IZabbixSenderClient;

  constructor(
    zabbixClient: IZabbixApiClient,
    zabbixSender: IZabbixSenderClient
  ) {
    this.zabbixClient = zabbixClient;
    this.zabbixSender = zabbixSender;
  }

  async updateLanLoadbalance(): Promise<void> {
    const healthCheckServer = config.healthCheckServer;
    try {
      logger.info("Fetching Hosts from Zabbix...");
      const hosts = await this.zabbixClient.getHosts("20");
      logger.info("Sucessfully fetched Hosts from Zabbix");

      const getMikrotikLoadbalances = hosts.map(async (host) => {
        try {
          const mikrotikClient = new MikroTikClient(
            host.interfaces[0].ip,
            config.mikrotikLanUser,
            config.mikrotikLanPassword
          );

          const link1 = await mikrotikClient.getPing(
            healthCheckServer,
            "ether1"
          );
          logger.info(`Pinging from ${host.host} eth1 done: ${link1}`);
          const link2 = await mikrotikClient.getPing(
            healthCheckServer,
            "ether2"
          );
          logger.info(`Pinging from ${host.host} eth2 done: ${link2}`);

          await this.zabbixSender.addData(
            host.host,
            "interface.uplink.status.1",
            link1 ? 1 : 0
          );

          await this.zabbixSender.addData(
            host.host,
            "interface.uplink.status.2",
            link2 ? 1 : 0
          );
        } catch (error) {
          logger.error(`Error on checking LoadBalances`, error);
        }
      });

      await Promise.allSettled(getMikrotikLoadbalances);

      logger.info("Sending data to Zabbix...");

      await this.zabbixSender.sendAll();
      logger.info("Data Successfuly to Zabbix...");
    } catch (error) {
      logger.error(`Error on checking LoadBalances`, error);
    }
  }
}
