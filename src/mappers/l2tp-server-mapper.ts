import { L2TPServer, L2TPServerInterface } from "@domain/l2tp-server";
import { IdentityDTO } from "@dto/mikrotik/identity-dto";
import { InterfaceDTO } from "@dto/mikrotik/interface-dto";
import { L2TPInterfaceDTO } from "@dto/mikrotik/l2tp-interface-dto";
import { ResourceDTO } from "@dto/mikrotik/resource-dto";

class MikrotikL2tpServerMapper {
  static toDomain(
    ipAddress: string,
    identityData: IdentityDTO,
    resourceData: ResourceDTO,
    l2tpInterfacesData: L2TPInterfaceDTO[],
    interfacesData: InterfaceDTO[]
  ): L2TPServer {
    const eth1 = interfacesData.find((i) => i["default-name"] === "ether1");
    const eth2 = interfacesData.find((i) => i["default-name"] === "ether2");
    const eth3 = interfacesData.find((i) => i["default-name"] === "ether3");

    const activeL2TPInterfaces = l2tpInterfacesData.filter(
      (i) => i.running === "true" && i.disabled === "false"
    );

    return {
      hostname: identityData.name,
      ipAddress,
      activeL2TPSessions: activeL2TPInterfaces.length,
      uptime: this.mikrotikUptimeToDays(resourceData.uptime),
      eth1: this.miktotikToLan(eth1),
      eth2: this.miktotikToLan(eth2),
      eth3: this.miktotikToLan(eth3),
    };
  }

  private static miktotikToLan(
    interfaceData: InterfaceDTO | undefined
  ): L2TPServerInterface | null {
    if (!interfaceData) return null;

    return {
      status: interfaceData.running === "true",
      name: interfaceData["default-name"],
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

export default MikrotikL2tpServerMapper;
