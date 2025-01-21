import Host from "@dto/zabbix/host";
import {
  ZABBIX_API_AUTHORIZATION_ERROR,
  ZABBIX_API_CONFIG_ERROR,
  ZABBIX_API_FETCHINGHOSTS_ERROR,
  ZABBIX_API_INVALID_PARAMETERS,
  ZABBIX_API_MISSING_AUTHENTICATION,
} from "@errors/zabbix-api";
import axios, { AxiosInstance } from "axios";
import { IZabbixApiClient } from "./i-zabbix-api-client";

interface AuthorizeResponseData {
  jsonrpc: string;
  result: string;
  id: number;
}

interface GetHostsResponseData {
  jsonrpc: string;
  result: Host[];
  id: number;
}

export class ZabbixApiClient implements IZabbixApiClient {
  private client: AxiosInstance;
  private authKey: string | null;

  constructor(zabbixApiUrl: string) {
    if (!zabbixApiUrl) {
      throw ZABBIX_API_CONFIG_ERROR;
    }

    this.authKey = null;
    this.client = axios.create({
      baseURL: zabbixApiUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async authorize(username: string, password: string): Promise<void> {
    if (!username || !password) throw ZABBIX_API_INVALID_PARAMETERS;
    try {
      const auth = await this.client.post<AuthorizeResponseData>("", {
        jsonrpc: "2.0",
        method: "user.login",
        params: {
          user: username,
          password: password,
        },
        id: 1,
        auth: null,
      });

      if (auth.status !== 200 || !auth.data)
        throw ZABBIX_API_AUTHORIZATION_ERROR;

      const authData = auth.data;

      this.authKey = authData.result;
    } catch (error) {
      throw ZABBIX_API_AUTHORIZATION_ERROR;
    }
  }

  async getHosts(groupId?: string): Promise<Host[]> {
    if (!this.authKey) throw ZABBIX_API_MISSING_AUTHENTICATION;

    try {
      const hosts = await this.client.post<GetHostsResponseData>("", {
        jsonrpc: "2.0",
        method: "host.get",
        params: {
          output: ["hostid", "host"],
          groupids: groupId,
          selectInterfaces: ["ip"],
        },
        id: 2,
        auth: this.authKey,
      });

      if (hosts.status !== 200) throw ZABBIX_API_FETCHINGHOSTS_ERROR;

      return hosts.data.result;
    } catch (error) {
      throw ZABBIX_API_FETCHINGHOSTS_ERROR;
    }
  }
}
