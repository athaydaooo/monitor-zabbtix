import axios, { AxiosInstance } from "axios";
import { IdentityDTO } from "@dto/mikrotik/identity-dto";
import { IMikroTikClient } from "./i-mikrotik-client";
import {
  getIdentityError,
  getPingError,
  getResourceError,
  MIKROTIK_API_ADDRESS_REQUIRED,
  MIKROTIK_API_CONFIG_ERROR,
} from "@errors/mikrotik-api";
import { ResourceDTO } from "@dto/mikrotik/resource-dto";
import { InterfaceDTO } from "@dto/mikrotik/interface-dto";
import { PingDTO } from "@dto/mikrotik/ping-dto";

export class MikroTikClient implements IMikroTikClient {
  private client: AxiosInstance;
  private address: string;

  constructor(ipAddress: string, username: string, password: string) {
    if (!ipAddress || !username || !password) {
      throw MIKROTIK_API_CONFIG_ERROR;
    }
    this.address = ipAddress;

    this.client = axios.create({
      baseURL: `http://${ipAddress}/rest`,
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

  async getResource(): Promise<ResourceDTO[]> {
    try {
      const uptime = await this.client.get<ResourceDTO[]>("/system/resource");

      if (uptime.status !== 200) throw getResourceError(this.address);

      return uptime.data;
    } catch (error) {
      throw getResourceError(this.address);
    }
  }

  async getIdentity(): Promise<IdentityDTO> {
    try {
      const identity = await this.client.get<IdentityDTO>("/system/identity/");

      if (identity.status !== 200) throw getIdentityError(this.address);

      return identity.data;
    } catch (error) {
      throw getIdentityError(this.address);
    }
  }

  async getInterfaces(): Promise<InterfaceDTO[]> {
    try {
      const interfaces = await this.client.get<InterfaceDTO[]>("/interface");

      if (interfaces.status !== 200) throw getIdentityError(this.address);

      return interfaces.data;
    } catch (error) {
      throw getIdentityError(this.address);
    }
  }
}
