import axios from 'axios';

export class ZabbixClient {
  private zabbixApiUrl: string;

  constructor(zabbixApiUrl: string) {
    this.zabbixApiUrl = zabbixApiUrl;
  }

  async getHosts(): Promise<{ ip: string; name: string }[]> {
    try {
      const response = await axios.get(`${this.zabbixApiUrl}/hosts`);
      return response.data.map((host: any) => ({
        ip: host.ip,
        name: host.name,
      }));
    } catch (error) {
      console.log('Erro ao consultar hosts no Zabbix:', error)
      throw error;
    }
  }
}