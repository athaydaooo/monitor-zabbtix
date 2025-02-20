import logger from "@utils/logger";
import updateAllL2TPServer from "jobs/update-all-l2tp-server";

(async () => {
  try {
    logger.info("Updating all L2TPServers.");
    await updateAllL2TPServer();
    logger.info("All L2TPServers were sucessfully updated!");
  } catch (error) {
    logger.error("Error trying to update L2TP Servers:", error);
    process.exit(1);
  }
})();
