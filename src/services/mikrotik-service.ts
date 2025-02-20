import { IMikroTikClient } from "@clients/mikrotik/i-mikrotik-client";
import { MikroTikClient } from "@clients/mikrotik/mikrotik-client";
import config from "@config/index";
import { L2TPServer } from "@domain/l2tp-server";
import { Lan } from "@domain/Lan";
import { MIKROTIK_SERVICE_GETLAN_ERROR } from "@errors/mikrotik-api";
import logger from "@utils/logger";
import MikrotikL2tpServerMapper from "mappers/l2tp-server-mapper";
import MikrotikLanMapper from "mappers/lan-mapper";

export class MikrotikService {
  private mikrotikClient: IMikroTikClient;
  private ipAddress: string;

  constructor(
    ipAddress: string,
    username?: string,
    password?: string,
    port?: number
  ) {
    this.ipAddress = ipAddress;

    this.mikrotikClient = new MikroTikClient(
      ipAddress,
      username || config.mikrotikUsername,
      password || config.mikrotikPassword,
      port
    );
  }

  async getLan(hostname: string): Promise<Lan> {
    try {
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

      const resolvedDns =
        await this.mikrotikClient.resolveDns(healthCheckServer);

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
    } catch (error) {
      logger.error(`Error trying to getLan data ${hostname}`, error);
      throw MIKROTIK_SERVICE_GETLAN_ERROR;
    }
  }

  async getL2TPServer(hostname: string): Promise<L2TPServer> {
    try {
      const identity = await this.mikrotikClient.getIdentity();
      const interfaces = await this.mikrotikClient.getInterfaces();
      const l2tpInterfaces = await this.mikrotikClient.getL2TPInterfaces();
      const resource = await this.mikrotikClient.getResource();

      const l2tpServer = MikrotikL2tpServerMapper.toDomain(
        this.ipAddress,
        identity,
        resource,
        l2tpInterfaces,
        interfaces
      );

      return l2tpServer;
    } catch (error) {
      logger.error(`Error trying to getL2TPServer data ${hostname}`, error);
      throw MIKROTIK_SERVICE_GETLAN_ERROR;
    }
  }
}
