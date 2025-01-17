import ZabbixSender from "zabbix-sender";

export class ZabbixSenderClient {
  private sender: ZabbixSender;

  constructor(zabbixServer: string, zabbixPort: number) {
    this.sender = new ZabbixSender({
      host: zabbixServer,
      port: zabbixPort,
    });
  }

  async sendData(host: string, key: string, value: number): Promise<void> {
    this.sender.addItem(host, key, value);
  }

  async sendAll(): Promise<void> {
    await this.sender.send().catch((error) => {
      throw error;
    });
  }
}
