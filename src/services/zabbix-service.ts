import { IZabbixSenderClient } from "@clients/zabbix-sender/i-zabbix-sender-client";
import { Lan, LanInterface } from "@domain/Lan";

export class ZabbixService {
  private zabbixSenderClient: IZabbixSenderClient;

  constructor(zabbixSenderClient: IZabbixSenderClient) {
    this.zabbixSenderClient = zabbixSenderClient;
  }

  async addLan(lanData: Lan): Promise<void> {
    await this.zabbixSenderClient.addData(
      lanData.hostname,
      "hostname",
      lanData.hostname
    );

    await this.zabbixSenderClient.addData(
      lanData.hostname,
      "ping",
      lanData.ping ? 1 : 0
    );
    await this.zabbixSenderClient.addData(
      lanData.hostname,
      "uptime",
      lanData.uptime
    );

    await this.sendInterfaceData(lanData.hostname, "eth1", lanData.eth1);
    await this.sendInterfaceData(lanData.hostname, "eth2", lanData.eth2);
    await this.sendInterfaceData(lanData.hostname, "eth3", lanData.eth3);
    await this.sendInterfaceData(lanData.hostname, "eth4", lanData.eth4);
    await this.sendInterfaceData(lanData.hostname, "eth5", lanData.eth5);
  }

  async clear(): Promise<void> {
    await this.zabbixSenderClient.clearItems();
  }

  async send(): Promise<void> {
    await this.zabbixSenderClient.sendAll();
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
