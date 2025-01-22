export default interface Host {
  hostid: string;
  host: string;
  name: string;
  status: string;
  available: string;
  description: string;
  proxy_hostid: string;
  inventory: {
    os: string;
    location: string;
  };
  tags: [
    {
      tag: string;
      value: string;
    },
  ];
  interfaces: [
    {
      interfaceid: string;
      ip: string;
      dns: string;
      port: string;
      type: string;
    },
  ];
}
