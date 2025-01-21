import { ZabbixClient } from "../clients/zabbix-api/zabbix-client";
import { ZabbixSenderClient } from "../clients/zabbix-sender-client";
import config from "../config";
import { AppError } from "../errors";
import { MonitorService } from "../services/monitor-service";
import logger from "../utils/logger";

async function main() {
  try {
    const zabbixSender = new ZabbixSenderClient(
      config.zabbixServer,
      config.zabbixServerPort
    );
    const zabbixClient = new ZabbixClient(config.zabbixApiUrl);
    await zabbixClient.authorize(
      config.zabbixApiUsername,
      config.zabbixApiPassword
    );

    const monitorService = new MonitorService(zabbixClient, zabbixSender);

    await monitorService.checkAllLoadBalances();
  } catch (error) {
    if (error instanceof AppError) logger.error(error.message, error);

    logger.error("Erro inesperado:", {
      message: error instanceof Error ? error.message : "Erro desconhecido",
      stack: error instanceof Error ? error.stack : null,
      rawError: error,
    });
  }
}

main();
