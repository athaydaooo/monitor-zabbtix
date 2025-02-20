import logger from "@utils/logger";
import updateAllL2TPServer from "jobs/update-all-l2tp-server";
import updateAllLans from "jobs/update-all-lan";
import cron from "node-cron";

cron.schedule("* * * * *", async () => {
  logger.info("Running updateAllLans");
  await updateAllLans();

  logger.info("Running updateAllL2TPServer");
  await updateAllL2TPServer();
});

cron.schedule("* * * * *", async () => {
  setTimeout(async () => {
    logger.info("Running updateAllLans");
    await updateAllLans();
    logger.info("Running updateAllL2TPServer");
    await updateAllL2TPServer();
  }, 30000);
});
