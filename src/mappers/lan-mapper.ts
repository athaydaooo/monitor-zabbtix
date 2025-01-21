import { Lan } from "@domain/Lan";
import { IdentityDTO } from "@dto/mikrotik/identity-dto";
import { InterfaceDTO } from "@dto/mikrotik/interface-dto";
import { PingDTO } from "@dto/mikrotik/ping-dto";
import { ResourceDTO } from "@dto/mikrotik/resource-dto";
import { miktotikToLan } from "@utils/mikrotik-to-lan";
import { mikrotikUptimeToDays } from "@utils/mikrotikuptime-to-days";

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
      ping: true,
      ipAddress,
      uptime: mikrotikUptimeToDays(resourceData.uptime),
      eth1: miktotikToLan(eth1, pingFromEth1),
      eth2: miktotikToLan(eth2, pingFromEth2),
      eth3: miktotikToLan(eth3),
      eth4: miktotikToLan(eth4),
      eth5: miktotikToLan(eth5),
    };
  }
}

export default MikrotikLanMapper;
