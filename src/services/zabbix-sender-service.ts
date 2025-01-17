import ZabbixSender from "zabbix-sender";

export class ZabbixSenderService {
  private sender: ZabbixSender;

  constructor(zabbixServer: string) {
    this.sender = new ZabbixSender(zabbixServer);
  }

  async sendData(host: string, key: string, value: number): Promise<void> {
    this.sender.addItem(host, key, value);
  }

  async sendAll(): Promise<void> {
    try {
      await this.sender.send();
      console.log("Dados enviados para o Zabbix com sucesso.");
    } catch (error) {
      console.log("Erro ao enviar dados para o Zabbix:", error);
    }
  }
}
