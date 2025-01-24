import { InterfaceDTO } from "@dto/mikrotik/interface-dto";
import { ResourceDTO } from "@dto/mikrotik/resource-dto";
import { IdentityDTO } from "@dto/mikrotik/identity-dto";
import { PingDTO } from "@dto/mikrotik/ping-dto";
import { ResolveDnsDTO } from "@dto/mikrotik/resolve-dns-dto";

export abstract class IMikroTikClient {
  abstract getPing(
    dstAddress: string,
    interfaceName?: string
  ): Promise<PingDTO[]>;

  abstract getResource(): Promise<ResourceDTO>;

  abstract getIdentity(): Promise<IdentityDTO>;

  abstract getInterfaces(): Promise<InterfaceDTO[]>;

  abstract resolveDns(domainName: string): Promise<ResolveDnsDTO>;
}
