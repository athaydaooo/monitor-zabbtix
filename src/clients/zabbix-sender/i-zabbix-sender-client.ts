export abstract class IZabbixSenderClient {
  abstract addData(
    host: string,
    key: string,
    value: string | number
  ): Promise<void>;

  abstract sendAll(): Promise<void>;
  abstract clearItems(): Promise<void>;
}
