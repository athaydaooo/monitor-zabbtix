import { SendInfo } from "./zabbix-sender-client";

export abstract class IZabbixSenderClient {
  abstract addData(
    host: string,
    key: string,
    value: string | number
  ): Promise<void>;

  abstract sendAll(): Promise<SendInfo>;
  abstract clearItems(): Promise<void>;
}
