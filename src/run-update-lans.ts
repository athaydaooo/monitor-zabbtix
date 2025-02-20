import logger from "@utils/logger";
import updateAllLans from "jobs/update-all-lan";

(async () => {
  try {
    logger.info("Updating all Lans.");
    await updateAllLans();
    logger.info("All Lans were sucessfully updated!");
  } catch (error) {
    logger.error("Error trying to update Lans:", error);
    process.exit(1);
  }
})();
