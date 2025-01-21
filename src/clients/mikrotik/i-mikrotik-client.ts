import { InterfaceDTO } from "../../types/dto/mikrotik/interface-dto";
import { ResourceDTO } from "../../types/dto/mikrotik/resource-dto";

export abstract class IMikroTikClient {
  abstract getPing(
    dstAddress: string,
    interfaceName?: string
  ): Promise<PingDTO[]>;

  abstract getResource(): Promise<ResourceDTO[]>;

  abstract getIdentity(): Promise<IdentityDTO>;

  abstract getInterfaces(): Promise<InterfaceDTO[]>;
}
