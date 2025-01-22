import Host from "@dto/zabbix/host";

export abstract class IZabbixApiClient {
  abstract authorize(username: string, password: string): Promise<void>;

  abstract getHosts(groupId?: string): Promise<Host[]>;
}
