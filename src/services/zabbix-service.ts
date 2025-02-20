import { IZabbixSenderClient } from "@clients/zabbix-sender/i-zabbix-sender-client";
import { L2TPServer, L2TPServerInterface } from "@domain/l2tp-server";
import { Lan, LanInterface } from "@domain/Lan";
import { HostData } from "@utils/get-lan-info-from-sheet";
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

    await this.zabbixSenderClient.addData(
      zabbixHostName,
      "dns",
      lanData.dns ? 1 : 0
    );

    await this.sendLanInterfaceData(zabbixHostName, "1", lanData.eth1);
    await this.sendLanInterfaceData(zabbixHostName, "2", lanData.eth2);
    await this.sendLanInterfaceData(zabbixHostName, "3", lanData.eth3);
    await this.sendLanInterfaceData(zabbixHostName, "4", lanData.eth4);
    await this.sendLanInterfaceData(zabbixHostName, "5", lanData.eth5);
  }

  async addLanData(lanData: HostData): Promise<void> {
    await this.zabbixSenderClient.addData(
      lanData.host,
      "latitude",
      lanData.latitude
    );

    await this.zabbixSenderClient.addData(
      lanData.host,
      "longitude",
      lanData.longitude
    );

    await this.zabbixSenderClient.addData(
      lanData.host,
      "descricao",
      lanData.name
    );
  }

  async addL2TPServer(
    zabbixHostName: string,
    l2tpServerData: L2TPServer
  ): Promise<void> {
    await this.zabbixSenderClient.addData(
      zabbixHostName,
      "sysname",
      l2tpServerData.hostname
    );

    await this.zabbixSenderClient.addData(
      zabbixHostName,
      "uptime",
      l2tpServerData.uptime
    );

    await this.zabbixSenderClient.addData(
      zabbixHostName,
      "l2tp.connections.active",
      l2tpServerData.activeL2TPSessions
    );

    await this.sendL2TPServerInterfaceData(
      zabbixHostName,
      "1",
      l2tpServerData.eth1
    );
    await this.sendL2TPServerInterfaceData(
      zabbixHostName,
      "2",
      l2tpServerData.eth2
    );
    await this.sendL2TPServerInterfaceData(
      zabbixHostName,
      "3",
      l2tpServerData.eth3
    );
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

  private async sendLanInterfaceData(
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

  private async sendL2TPServerInterfaceData(
    hostname: string,
    interfaceName: string,
    interfaceData: L2TPServerInterface | null
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
