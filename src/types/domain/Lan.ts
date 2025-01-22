export interface Lan {
  hostname: string;
  ipAddress: string;
  uptime: number;
  eth1: LanInterface | null;
  eth2: LanInterface | null;
  eth3: LanInterface | null;
  eth4: LanInterface | null;
  eth5: LanInterface | null;
}

export interface LanInterface {
  status: boolean;
  rx: number;
  tx: number;
}
