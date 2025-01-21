import { LanInterface } from "@domain/Lan";
import { InterfaceDTO } from "@dto/mikrotik/interface-dto";
import { PingDTO } from "@dto/mikrotik/ping-dto";

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
