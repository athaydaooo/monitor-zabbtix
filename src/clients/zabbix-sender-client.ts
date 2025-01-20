import ZabbixSender from "zabbix-sender";
import {
  ZABBIX_SENDER_CONFIG_ERROR,
  ZABBIX_SENDER_SENDDATA_ERROR,
} from "../errors/zabbix-server";
import { AppError } from "../errors";

export class ZabbixSenderClient {
  private sender: ZabbixSender;

  constructor(zabbixServer: string, zabbixPort: number) {
    if (!zabbixServer || !zabbixPort) {
      throw ZABBIX_SENDER_CONFIG_ERROR;
    }

    this.sender = new ZabbixSender({
      host: zabbixServer,
      port: zabbixPort,
    });
  }

  async addData(host: string, key: string, value: number): Promise<void> {
    if (!host || !key || value === undefined || value === null) {
      throw ZABBIX_SENDER_CONFIG_ERROR;
    }

    try {
      this.sender.addItem(host, key, value);
    } catch (error) {
      throw new AppError(
        `Failed to add HOST:${host} data to Zabbix Server`,
        500,
        "ZABBIX_ADD_DATA_ERROR"
      );
    }
  }

  async sendAll(): Promise<void> {
    try {
      const response = await this.sender.send();

      // Verifica se o envio foi bem-sucedido
      if (!response || !response.success) {
        throw ZABBIX_SENDER_SENDDATA_ERROR;
      }
    } catch (error) {
      throw error;
    }
  }
}
