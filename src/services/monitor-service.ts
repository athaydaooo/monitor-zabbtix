import { MikroTikClient } from "../clients/mikrotik-client";
import { ZabbixClient } from "../clients/zabbix-client";
import { ZabbixSenderClient } from "../clients/zabbix-sender-client";
import config from "../config";
import logger from "../utils/logger";

export class MonitorService {
  private zabbixClient: ZabbixClient;
  private zabbixSender: ZabbixSenderClient;

  constructor(zabbixClient: ZabbixClient, zabbixSender: ZabbixSenderClient) {
    this.zabbixClient = zabbixClient;
    this.zabbixSender = zabbixSender;
  }

  async checkAllLoadBalances(): Promise<void> {
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

          const link1 = await mikrotikClient.ping(healthCheckServer, "ether1");
          logger.info(`Pinging from ${host.host} eth1 done: ${link1}`);
          const link2 = await mikrotikClient.ping(healthCheckServer, "ether2");
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
