import { MikroTikClient } from "../clients/mikrotik-client";
import { ZabbixClient } from "../clients/zabbix-client";
import { ZabbixSenderClient } from "../clients/zabbix-sender-client";

export class MonitorService {
  private zabbixClient: ZabbixClient;
  private zabbixSender: ZabbixSenderClient;

  constructor(zabbixClient: ZabbixClient, zabbixSender: ZabbixSenderClient) {
    this.zabbixClient = zabbixClient;
    this.zabbixSender = zabbixSender;
  }

  async checkAllLoadBalances(): Promise<void> {
    const hosts = await this.zabbixClient.getHosts("20");

    hosts.forEach((host) => {
      const mikrotikClient = new MikroTikClient(host.interfaces[0].ip, "", "");

      const link1 = await mikrotikClient.ping("google.com", "ether1");
      const link2 = await mikrotikClient.ping("google.com", "ether2");

      await this.zabbixSender.sendData(
        host.name,
        "key.interface.uplink.1",
        link1
      );
    });
  }
}
