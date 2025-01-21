import { LanInterface } from "../types/domain/Lan";
import { InterfaceDTO } from "../types/dto/mikrotik/interface-dto";

export function miktotikToLan(
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
