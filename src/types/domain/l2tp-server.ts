export interface L2TPServer {
  hostname: string;
  ipAddress: string;
  uptime: number;
  activeL2TPSessions: number;
  eth1: L2TPServerInterface | null;
  eth2: L2TPServerInterface | null;
  eth3: L2TPServerInterface | null;
}

export interface L2TPServerInterface {
  name: string;
  status: boolean;
  disabled: boolean;
  rx: number;
  tx: number;
}
