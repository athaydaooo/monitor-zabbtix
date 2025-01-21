import { AppError } from "@errors/index";
import {
  ZABBIX_SENDER_CONFIG_ERROR,
  ZABBIX_SENDER_SENDDATA_ERROR,
} from "@errors/zabbix-server";
import ZabbixSender, { ZabbixSenderResponse } from "node-zabbix-sender";
import { IZabbixSenderClient } from "./i-zabbix-sender-client";

export class ZabbixSenderClient implements IZabbixSenderClient {
  private sender: ZabbixSender;

  constructor(zabbixServer: string, zabbixPort?: number) {
    if (!zabbixServer || !zabbixPort) {
      throw ZABBIX_SENDER_CONFIG_ERROR;
    }

    this.sender = new ZabbixSender({ host: zabbixServer, port: zabbixPort });
  }

  async addData(
    host: string,
    key: string,
    value: string | number
  ): Promise<void> {
    if (!host || !key || value === undefined || value === null) {
      throw ZABBIX_SENDER_CONFIG_ERROR;
    }

    try {
      await this.sender.addItem(host, key, value);
    } catch (error) {
      throw new AppError(
        `Failed to add HOST:${host} data to Zabbix Server`,
        500,
        "ZABBIX_ADD_DATA_ERROR"
      );
    }
  }

  async sendAll(): Promise<void> {
    const sendPromise = () =>
      new Promise<ZabbixSenderResponse>((resolve, reject) => {
        this.sender.send((err, res) => {
          if (err) {
            reject(ZABBIX_SENDER_SENDDATA_ERROR); // Rejeita a Promise com o erro
          } else {
            resolve(res); // Resolve a Promise com a resposta
          }
        });
      });

    try {
      const sentData = await sendPromise();

      if (!sentData || sentData.response != "success") {
        throw ZABBIX_SENDER_SENDDATA_ERROR;
      }
    } catch (error) {
      throw ZABBIX_SENDER_SENDDATA_ERROR;
    }
  }

  async clearItems(): Promise<void> {
    try {
      await this.sender.clearItems();
    } catch (error) {
      throw new AppError(
        `Failed to clear items `,
        500,
        "ZABBIX_CLEAR_DATA_ERROR"
      );
    }
  }
}
