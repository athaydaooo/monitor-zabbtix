import logger from "@utils/logger";
import updateAllLans from "jobs/update-all-lan";
import cron from "node-cron";

cron.schedule("* * * * *", async () => {
  logger.info("Running updateAllLans");
  await updateAllLans();
});

cron.schedule("* * * * *", async () => {
  setTimeout(async () => {
    logger.info("Running updateAllLans");
    await updateAllLans();
  }, 30000);
});
