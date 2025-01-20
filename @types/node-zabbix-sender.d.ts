declare module "node-zabbix-sender" {
  interface ZabbixSenderOptions {
    host: string;
    port?: number;
    timeout?: number;
    with_timestamps?: boolean;
    with_ns?: boolean;
  }

  export interface ZabbixSenderResponse {
    response: string;
    info: string;
  }

  class ZabbixSender {
    constructor(options: ZabbixSenderOptions);

    addItem(host: string, key: string, value: string | number): void;

    send(
      callback: (err: Error | null, res: ZabbixSenderResponse) => void
    ): void;

    clearItems(): void;

    getItems(): Array<{ host: string; key: string; value: string | number }>;
  }

  export = ZabbixSender;
}
