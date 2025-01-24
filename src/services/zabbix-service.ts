import { IZabbixSenderClient } from "@clients/zabbix-sender/i-zabbix-sender-client";
import { Lan, LanInterface } from "@domain/Lan";
import logger from "@utils/logger";

export class ZabbixService {
  private zabbixSenderClient: IZabbixSenderClient;

  constructor(zabbixSenderClient: IZabbixSenderClient) {
    this.zabbixSenderClient = zabbixSenderClient;
  }

  async addLan(zabbixHostName: string, lanData: Lan): Promise<void> {
    await this.zabbixSenderClient.addData(
      zabbixHostName,
      "sysname",
      lanData.hostname
    );

    await this.zabbixSenderClient.addData(
      zabbixHostName,
      "uptime",
      lanData.uptime
    );

    await this.sendInterfaceData(zabbixHostName, "1", lanData.eth1);
    await this.sendInterfaceData(zabbixHostName, "2", lanData.eth2);
    await this.sendInterfaceData(zabbixHostName, "3", lanData.eth3);
    await this.sendInterfaceData(zabbixHostName, "4", lanData.eth4);
    await this.sendInterfaceData(zabbixHostName, "5", lanData.eth5);
  }

  async clear(): Promise<void> {
    await this.zabbixSenderClient.clearItems();
  }

  async send(hostname: string): Promise<void> {
    const sentData = await this.zabbixSenderClient.sendAll();

    if (sentData.failed > 0) {
      logger.info(`${hostname} - Data sent with ${sentData.failed} failed`);
      return;
    }

    logger.info(`${hostname} - Data sent successfully`);
  }

  private async sendInterfaceData(
    hostname: string,
    interfaceName: string,
    interfaceData: LanInterface | null
  ): Promise<void> {
    if (interfaceData) {
      await this.zabbixSenderClient.addData(
        hostname,
        `interface.status.${interfaceName}`,
        interfaceData.status ? 1 : 0
      );
      await this.zabbixSenderClient.addData(
        hostname,
        `interface.disabled.${interfaceName}`,
        interfaceData.disabled ? 1 : 0
      );
      await this.zabbixSenderClient.addData(
        hostname,
        `interface.isuplink.${interfaceName}`,
        interfaceData.isUplink ? 1 : 0
      );
      await this.zabbixSenderClient.addData(
        hostname,
        `interface.rx.${interfaceName}`,
        interfaceData.rx
      );
      await this.zabbixSenderClient.addData(
        hostname,
        `interface.tx.${interfaceName}`,
        interfaceData.tx
      );
    }
  }
}
