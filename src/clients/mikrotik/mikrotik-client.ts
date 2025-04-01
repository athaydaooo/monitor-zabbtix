import axios, { AxiosInstance } from "axios";
import { IdentityDTO } from "@dto/mikrotik/identity-dto";
import { IMikroTikClient } from "./i-mikrotik-client";
import {
  getIdentityError,
  getInterfacesError,
  getIpDnsError,
  getL2TPInterfacesError,
  getPingError,
  getResourceError,
  getRouterboardError,
  MIKROTIK_API_ADDRESS_REQUIRED,
  MIKROTIK_API_CONFIG_ERROR,
  MIKROTIK_API_RESOLVEDNS_ERROR,
} from "@errors/mikrotik-api";
import { ResourceDTO } from "@dto/mikrotik/resource-dto";
import { InterfaceDTO } from "@dto/mikrotik/interface-dto";
import { PingDTO } from "@dto/mikrotik/ping-dto";
import { ResolveDnsDTO } from "@dto/mikrotik/resolve-dns-dto";
import { L2TPInterfaceDTO } from "@dto/mikrotik/l2tp-interface-dto";
import { IpDnsDTO } from "@dto/mikrotik/ip-dns-dto";
import { RouterboardDTO } from "@dto/mikrotik/routerboard-dto";

export class MikroTikClient implements IMikroTikClient {
  private client: AxiosInstance;
  private address: string;

  constructor(
    ipAddress: string,
    username: string,
    password: string,
    port?: number
  ) {
    if (!ipAddress || !username || !password) {
      throw MIKROTIK_API_CONFIG_ERROR;
    }
    this.address = ipAddress;
    this.client = axios.create({
      timeout: 3000,
      baseURL: `http://${ipAddress}:${port || 80}/rest`,
      auth: {
        username,
        password,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getPing(
    dstAddress: string,
    interfaceName?: string
  ): Promise<PingDTO[]> {
    if (!dstAddress) {
      throw MIKROTIK_API_ADDRESS_REQUIRED;
    }

    try {
      const ping = await this.client.post<PingDTO[]>("/ping", {
        address: dstAddress,
        interface: interfaceName,
        count: 2,
      });

      if (ping.status !== 200) throw getPingError(this.address, dstAddress);

      return ping.data;
    } catch (error) {
      throw getPingError(this.address, dstAddress);
    }
  }

  async getResource(): Promise<ResourceDTO> {
    try {
      const uptime = await this.client.get<ResourceDTO>("/system/resource");

      if (uptime.status !== 200) throw getResourceError(this.address);

      return uptime.data;
    } catch (error) {
      throw getResourceError(this.address);
    }
  }

  async getIdentity(): Promise<IdentityDTO> {
    try {
      const identity = await this.client.get<IdentityDTO>("/system/identity");

      if (identity.status !== 200) throw getIdentityError(this.address);

      return identity.data;
    } catch (error) {
      throw getIdentityError(this.address);
    }
  }

  async getIpDns(): Promise<IpDnsDTO> {
    try {
      const response = await this.client.get<IpDnsDTO>("/ip/dns");

      if (response.status !== 200) throw getIdentityError(this.address);

      return response.data;
    } catch (error) {
      throw getIpDnsError(this.address);
    }
  }

  async getRouterboard(): Promise<RouterboardDTO> {
    try {
      const response = await this.client.get<RouterboardDTO>(
        "/system/routerboard"
      );

      if (response.status !== 200) throw getIdentityError(this.address);

      return response.data;
    } catch (error) {
      throw getRouterboardError(this.address);
    }
  }

  async getInterfaces(): Promise<InterfaceDTO[]> {
    try {
      const interfaces = await this.client.get<InterfaceDTO[]>("/interface");

      if (interfaces.status !== 200) throw getInterfacesError(this.address);

      return interfaces.data;
    } catch (error) {
      throw getInterfacesError(this.address);
    }
  }

  async getL2TPInterfaces(): Promise<L2TPInterfaceDTO[]> {
    try {
      const interfaces = await this.client.get<L2TPInterfaceDTO[]>(
        "/interface/l2tp-server"
      );

      if (interfaces.status !== 200) throw getL2TPInterfacesError(this.address);

      return interfaces.data;
    } catch (error) {
      throw getL2TPInterfacesError(this.address);
    }
  }

  async resolveDns(domainName: string): Promise<ResolveDnsDTO> {
    try {
      const resolvedDns = await this.client.post<ResolveDnsDTO>("/resolve", {
        "domain-name": domainName,
      });

      if (resolvedDns.status !== 200) throw MIKROTIK_API_RESOLVEDNS_ERROR;

      return resolvedDns.data;
    } catch (error) {
      throw MIKROTIK_API_RESOLVEDNS_ERROR;
    }
  }
}
