import { AppError } from ".";

//ZABBIX SENDER
export const ZABBIX_SENDER_CONFIG_ERROR = new AppError(
  "Zabbix server and port are required to build Zabbix Sender",
  400,
  "ZABBIX_CONFIG_ERROR"
);

export const ZABBIX_SENDER_INVALID_PARAMETERS = new AppError(
  "Host, key, and value are required to add Data",
  400,
  "ZABBIX_SENDER.INVALID_PARAMETERS"
);

export const ZABBIX_SENDER_SENDDATA_ERROR = new AppError(
  "Failed to send data to Zabbix.",
  500,
  "ZABBIX_SEND_ERROR"
);
