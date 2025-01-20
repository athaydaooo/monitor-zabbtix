import { MikroTikClient } from "../clients/mikrotik-client";
import { ZabbixClient } from "../clients/zabbix-client";
import { ZabbixSenderClient } from "../clients/zabbix-sender-client";
import config from "../config";
import { AppError } from "../errors";
import LoggerUtil from "../utils/logger";

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
      const hosts = await this.zabbixClient.getHosts("20");

      hosts.forEach(async (host) => {
        const mikrotikClient = new MikroTikClient(
          host.interfaces[0].ip,
          config.mikrotikLanUser,
          config.mikrotikLanPassword
        );

        const link1 = await mikrotikClient.ping(healthCheckServer, "ether1");
        const link2 = await mikrotikClient.ping(healthCheckServer, "ether2");

        await this.zabbixSender.addData(
          host.name,
          "key.interface.uplink.1",
          link1 ? 1 : 0
        );

        await this.zabbixSender.addData(
          host.name,
          "key.interface.uplink.2",
          link2 ? 1 : 0
        );
      });

      await this.zabbixSender.sendAll();
    } catch (error) {
      const logger = new LoggerUtil();

      if (error instanceof AppError) logger.error(error.message, error);

      logger.error("Erro inesperado:", {
        message: error instanceof Error ? error.message : "Erro desconhecido",
        stack: error instanceof Error ? error.stack : null,
        rawError: error,
      });
    }
  }
}
