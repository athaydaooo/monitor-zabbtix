import { IMikroTikClient } from "@clients/mikrotik/i-mikrotik-client";
import { MikroTikClient } from "@clients/mikrotik/mikrotik-client";
import config from "@config/index";
import { Lan } from "@domain/Lan";
import MikrotikLanMapper from "mappers/lan-mapper";

export class MikrotikService {
  private mikrotikClient: IMikroTikClient;
  private ipAddress: string;

  constructor(ipAddress: string) {
    this.ipAddress = ipAddress;
    this.mikrotikClient = new MikroTikClient(
      ipAddress,
      config.mikrotikLanUser,
      config.mikrotikLanPassword
    );
  }

  async getLan(): Promise<Lan> {
    const healthCheckServer = config.healthCheckServer;

    const identity = await this.mikrotikClient.getIdentity();
    const interfaces = await this.mikrotikClient.getInterfaces();
    const resource = await this.mikrotikClient.getResource();
    const pingFromEth1 = await this.mikrotikClient.getPing(
      healthCheckServer,
      "ether1"
    );
    const pingFromEth2 = await this.mikrotikClient.getPing(
      healthCheckServer,
      "ether2"
    );
    const pingFromEth3 = await this.mikrotikClient.getPing(
      healthCheckServer,
      "ether3"
    );
    const pingFromEth4 = await this.mikrotikClient.getPing(
      healthCheckServer,
      "ether3"
    );

    const resolvedDns = await this.mikrotikClient.resolveDns(healthCheckServer);

    const lan = MikrotikLanMapper.toDomain(
      this.ipAddress,
      identity,
      resource,
      interfaces,
      pingFromEth1,
      pingFromEth2,
      pingFromEth3,
      pingFromEth4,
      resolvedDns
    );

    return lan;
  }
}
