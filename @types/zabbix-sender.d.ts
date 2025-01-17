declare module 'zabbix-sender' {
    interface ZabbixSenderOptions {
      host: string;
      port?: number;
      timeout?: number;
      with_timestamps?: boolean;
    }
  
    interface ZabbixSenderItem {
      host: string;
      key: string;
      value: string | number;
      clock?: number;
    }
  
    class ZabbixSender {
      constructor(options: ZabbixSenderOptions | string);
      addItem(host: string, key: string, value: string | number, clock?: number): void;
      clearItems(): void;
      send(callback?: (err: Error | null, response: any) => void): Promise<any>;
    }
  
    export = ZabbixSender;
  }