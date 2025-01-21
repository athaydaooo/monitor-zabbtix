export abstract class ZabbixSenderClient {
  abstract addData(host: string, key: string, value: number): Promise<void>;

  abstract sendAll(): Promise<void>;
}
