import logger from "@utils/logger";
import updateAllL2TPServer from "jobs/update-all-l2tp-server";
import updateAllLans from "jobs/update-all-lan";
import cron from "node-cron";

//LAN CRON
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

//L2TP SERVER CRON
cron.schedule("* * * * *", async () => {
  setTimeout(async () => {
    logger.info("Running updateAllL2TPServer");
    await updateAllL2TPServer();
  }, 15000);
});

cron.schedule("* * * * *", async () => {
  setTimeout(async () => {
    logger.info("Running updateAllL2TPServer");
    await updateAllL2TPServer();
  }, 45000);
});
