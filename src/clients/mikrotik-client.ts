import axios from 'axios';
export class MikroTikClient {
  private username: string;
  private password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  async testPing(mikrotikIp: string, dstAddress: string ,interfaceName: string): Promise<number> {
    try {
      const url = `http://${mikrotikIp}/rest/ping`;
      const response = await axios.get(url, {
        auth: {
          username: this.username,
          password: this.password,
        },
        params: {
          address: dstAddress,
          interface: interfaceName,
          count: 4,
        },
      });

      return response.data['avg-rtt'];
    } catch (error) {
      console.log(`Erro ao testar ping na interface ${interfaceName} da MikroTik ${mikrotikIp}:`, error);
      throw error;
    }
  }
}