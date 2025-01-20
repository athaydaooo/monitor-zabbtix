import axios, { AxiosInstance } from "axios";
import {
  MIKROTIK_API_ADDRESS_REQUIRED,
  MIKROTIK_API_CONFIG_ERROR,
  MIKROTIK_API_PING_ERROR,
} from "../errors/mikrotik-api";
import { AppError } from "../errors";

interface PingResponseData {
  "packet-loss": string;
  received: string;
  sent: string;
}
export class MikroTikClient {
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

  async ping(dstAddress: string, interfaceName?: string): Promise<boolean> {
    if (!dstAddress) {
      throw MIKROTIK_API_ADDRESS_REQUIRED;
    }

    try {
      const pingStatus = await this.client.post<PingResponseData[]>("ping", {
        address: dstAddress,
        interface: interfaceName,
        count: 2,
      });

      if (pingStatus.status !== 200) return false;

      return pingStatus.data.every((element: PingResponseData) => {
        return element.sent === element.received;
      });
    } catch (error) {
      console.log(error);
      throw new AppError(
        `Error trying to ping the destination address from ${this.address}.`,
        400,
        "MIKROTIK_API.PING_ERROR"
      );
    }
  }
}
