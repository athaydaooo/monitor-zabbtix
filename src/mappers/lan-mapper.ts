import { Lan, LanInterface } from "@domain/Lan";
import { IdentityDTO } from "@dto/mikrotik/identity-dto";
import { InterfaceDTO } from "@dto/mikrotik/interface-dto";
import { IpDnsDTO } from "@dto/mikrotik/ip-dns-dto";
import { PingDTO } from "@dto/mikrotik/ping-dto";
import { ResolveDnsDTO } from "@dto/mikrotik/resolve-dns-dto";
import { ResourceDTO } from "@dto/mikrotik/resource-dto";
import { RouterboardDTO } from "@dto/mikrotik/routerboard-dto";

class MikrotikLanMapper {
  static toDomain(
    ipAddress: string,
    identityData: IdentityDTO,
    routerboardData: RouterboardDTO,
    ipDnsData: IpDnsDTO,
    resourceData: ResourceDTO,
    interfacesData: InterfaceDTO[],
    ping: PingDTO[],
    pingFromEth1: PingDTO[],
    pingFromEth2: PingDTO[],
    pingFromEth3: PingDTO[],
    pingFromEth4: PingDTO[],
    resolvedDns: ResolveDnsDTO
  ): Lan {
    const eth1 = interfacesData.find((i) => i["default-name"] === "ether1");
    const eth2 = interfacesData.find((i) => i["default-name"] === "ether2");
    const eth3 = interfacesData.find((i) => i["default-name"] === "ether3");
    const eth4 = interfacesData.find((i) => i["default-name"] === "ether4");
    const eth5 = interfacesData.find((i) => i["default-name"] === "ether5");

    const dnsAdresses = ipDnsData.servers.split(",");

    const latency = ping.every((element) => element.sent === element.received)
      ? parseInt(ping[0].time.split("ms")[0])
      : -1;
    const packetLoss = ping.every(
      (element) => element.sent === element.received
    )
      ? parseInt(ping[0]["packet-loss"])
      : -1;

    return {
      hostname: identityData.name,
      ipAddress,
      dnsAdresses,
      latency,
      model: routerboardData.model,
      version: resourceData.version,
      packetLoss,
      dns: !!resolvedDns.ret,
      uptime: this.mikrotikUptimeToDays(resourceData.uptime),
      eth1: this.miktotikToLan(eth1, pingFromEth1),
      eth2: this.miktotikToLan(eth2, pingFromEth2),
      eth3: this.miktotikToLan(eth3, pingFromEth3),
      eth4: this.miktotikToLan(eth4, pingFromEth4),
      eth5: this.miktotikToLan(eth5),
    };
  }

  private static miktotikToLan(
    interfaceData: InterfaceDTO | undefined,
    pingData?: PingDTO[]
  ): LanInterface | null {
    if (!interfaceData) return null;

    const provedores = [
      "claro",
      "algar",
      "vivo",
      "desktop",
      "polotel",
      "netcom",
      "niufibra",
      "canet",
      "netwins",
    ];

    const isUplink = provedores.some((provedor) => {
      if (interfaceData.comment === undefined) return false;

      return interfaceData.comment
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(provedor);
    });

    let pingStatus;
    if (!!pingData && isUplink) {
      pingStatus = pingData.every((element) => {
        return element.sent === element.received;
      });
    }

    return {
      status: pingStatus ? pingStatus : interfaceData.running === "true",
      name: interfaceData["default-name"],
      isUplink,
      comment: interfaceData.comment || "",
      mac: interfaceData["mac-address"],
      type: interfaceData.type,
      disabled: interfaceData.disabled === "true",
      rx: Number(interfaceData["rx-byte"]),
      tx: Number(interfaceData["tx-byte"]),
    };
  }

  private static mikrotikUptimeToDays(uptime: string): number {
    const weeksMatch = uptime.match(/(\d+)w/);
    const daysMatch = uptime.match(/(\d+)d/);

    const weeks = weeksMatch ? parseInt(weeksMatch[1]) : 0;
    const days = daysMatch ? parseInt(daysMatch[1]) : 0;

    const totalDays = Math.ceil(weeks * 7 + days);

    return totalDays;
  }
}

export default MikrotikLanMapper;
