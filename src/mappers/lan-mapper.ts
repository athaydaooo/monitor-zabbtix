import { Lan, LanInterface } from "@domain/Lan";
import { IdentityDTO } from "@dto/mikrotik/identity-dto";
import { InterfaceDTO } from "@dto/mikrotik/interface-dto";
import { PingDTO } from "@dto/mikrotik/ping-dto";
import { ResourceDTO } from "@dto/mikrotik/resource-dto";

class MikrotikLanMapper {
  static toDomain(
    ipAddress: string,
    identityData: IdentityDTO,
    resourceData: ResourceDTO,
    interfacesData: InterfaceDTO[],
    pingFromEth1: PingDTO[],
    pingFromEth2: PingDTO[]
  ): Lan {
    const eth1 = interfacesData.find((i) => i["default-name"] === "ether1");
    const eth2 = interfacesData.find((i) => i["default-name"] === "ether2");
    const eth3 = interfacesData.find((i) => i["default-name"] === "ether3");
    const eth4 = interfacesData.find((i) => i["default-name"] === "ether4");
    const eth5 = interfacesData.find((i) => i["default-name"] === "ether5");

    return {
      hostname: identityData.name,
      ipAddress,
      uptime: this.mikrotikUptimeToDays(resourceData.uptime),
      eth1: this.miktotikToLan(eth1, pingFromEth1),
      eth2: this.miktotikToLan(eth2, pingFromEth2),
      eth3: this.miktotikToLan(eth3),
      eth4: this.miktotikToLan(eth4),
      eth5: this.miktotikToLan(eth5),
    };
  }

  private static miktotikToLan(
    interfaceData: InterfaceDTO | undefined,
    pingData?: PingDTO[]
  ): LanInterface | null {
    if (!interfaceData) return null;

    let pingStatus;
    if (!!pingData) {
      pingStatus = pingData.every((element) => {
        return element.sent === element.received;
      });
    }

    return {
      status: pingStatus ? pingStatus : interfaceData.running === "true",
      rx: Number(interfaceData["rx-byte"]),
      tx: Number(interfaceData["tx-byte"]),
    };
  }

  private static mikrotikUptimeToDays(uptime: string): string {
    const weeksMatch = uptime.match(/(\d+)w/);
    const daysMatch = uptime.match(/(\d+)d/);

    const weeks = weeksMatch ? parseInt(weeksMatch[1]) : 0;
    const days = daysMatch ? parseInt(daysMatch[1]) : 0;

    const totalDays = weeks * 7 + days;

    return `${totalDays}d`;
  }
}

export default MikrotikLanMapper;
