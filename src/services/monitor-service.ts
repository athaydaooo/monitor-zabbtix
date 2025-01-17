import { MikroTikClient } from "../clients/mikrotik-client";
import { ZabbixClient } from "../clients/zabbix-client";
import { ZabbixSenderService } from "./zabbix-sender-service";

export class MonitorService {
  private zabbixClient: ZabbixClient;
  private mikrotikClient: MikroTikClient;
  private zabbixSender: ZabbixSenderService;

  constructor(
    zabbixApiUrl: string,
    mikrotikUsername: string,
    mikrotikPassword: string,
    zabbixServer: string
  ) {
    this.zabbixClient = new ZabbixClient(zabbixApiUrl);
    this.mikrotikClient = new MikroTikClient(
      mikrotikUsername,
      mikrotikPassword
    );
    this.zabbixSender = new ZabbixSenderService(zabbixServer);
  }

  async loadBalanceMonitor(): Promise<void> {
    const dstAddress = "google.com";
    try {
      const hosts = await this.zabbixClient.getHosts();

      for (const host of hosts) {
        const { ip, name } = host;

        try {
          const interface1Ping = await this.mikrotikClient.testPing(
            ip,
            dstAddress,
            "ether1"
          );
          const interface2Ping = await this.mikrotikClient.testPing(
            ip,
            dstAddress,
            "ether2"
          );

          await this.zabbixSender.sendData(
            name,
            "mikrotik.interface1.ping",
            interface1Ping
          );
          await this.zabbixSender.sendData(
            name,
            "mikrotik.interface2.ping",
            interface2Ping
          );
        } catch (error) {
          console.log(`Erro ao processar MikroTik ${ip}:`, error);
        }
      }

      await this.zabbixSender.sendAll();
    } catch (error) {
      console.log("Erro no processo de monitoramento:", error);
    }
  }
}
