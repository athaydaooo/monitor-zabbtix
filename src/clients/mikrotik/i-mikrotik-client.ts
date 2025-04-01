import { InterfaceDTO } from "@dto/mikrotik/interface-dto";
import { ResourceDTO } from "@dto/mikrotik/resource-dto";
import { IdentityDTO } from "@dto/mikrotik/identity-dto";
import { PingDTO } from "@dto/mikrotik/ping-dto";
import { ResolveDnsDTO } from "@dto/mikrotik/resolve-dns-dto";
import { L2TPInterfaceDTO } from "@dto/mikrotik/l2tp-interface-dto";
import { RouterboardDTO } from "@dto/mikrotik/routerboard-dto";
import { IpDnsDTO } from "@dto/mikrotik/ip-dns-dto";

export abstract class IMikroTikClient {
  abstract getPing(
    dstAddress: string,
    interfaceName?: string
  ): Promise<PingDTO[]>;

  abstract getResource(): Promise<ResourceDTO>;

  abstract getIdentity(): Promise<IdentityDTO>;

  abstract getRouterboard(): Promise<RouterboardDTO>;

  abstract getIpDns(): Promise<IpDnsDTO>;

  abstract getInterfaces(): Promise<InterfaceDTO[]>;

  abstract getL2TPInterfaces(): Promise<L2TPInterfaceDTO[]>;

  abstract resolveDns(domainName: string): Promise<ResolveDnsDTO>;
}
