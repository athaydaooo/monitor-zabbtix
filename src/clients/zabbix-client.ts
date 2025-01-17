import axios, { AxiosInstance } from "axios";
import Host from "../entities/host";

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

export class ZabbixClient {
  private client: AxiosInstance;
  private authKey: string | null;

  constructor(zabbixApiUrl: string) {
    this.authKey = null;
    this.client = axios.create({
      baseURL: zabbixApiUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async authorize(username: string, password: string): Promise<void> {
    const auth = await this.client
      .post("", {
        body: {
          jsonrpc: "2.0",
          method: "user.login",
          params: {
            user: username,
            password: password,
          },
          id: 1,
          auth: null,
        },
      })
      .then((response) => response)
      .catch((err) => err.response);

    if (auth.status !== 200) throw Error("autenticacao falhou");

    this.authKey = auth.data.result;
  }

  async getHosts(groupId?: string): Promise<Host[]> {
    const hosts = await this.client
      .post("", {
        body: {
          jsonrpc: "2.0",
          method: "host.get",
          params: {
            output: ["hostid", "host"],
            groupids: groupId,
          },
          id: 2,
          auth: this.authKey,
        },
      })
      .then((response) => response.data as AuthorizeResponseData)
      .catch((err) => err.response);

    if (hosts.status !== 200) return [];

    return hosts.data.result;
  }
}
