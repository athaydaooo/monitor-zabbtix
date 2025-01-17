import axios, { AxiosInstance } from "axios";

interface PingResponseData {
  "packet-loss": string;
  received: string;
  sent: string;
}
export class MikroTikClient {
  private client: AxiosInstance;

  constructor(ipAddress: string, username: string, password: string) {
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

  async ping(dstAddress: string, interfaceName: string): Promise<number> {
    const pingStatus = await this.client
      .post("ping", {
        params: {
          address: dstAddress,
          interface: interfaceName,
          count: 2,
        },
      })
      .then((response) => response)
      .catch((err) => err.response);

    if (pingStatus.status !== 200) return 0;

    const allPingsSuccessful = pingStatus.data.every(
      (element: PingResponseData) => {
        return element.sent === element.received;
      }
    );

    return allPingsSuccessful ? 1 : 0;
  }
}
