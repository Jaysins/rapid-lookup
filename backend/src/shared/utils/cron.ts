import cron from 'node-cron';
import logger from './logger';

export const scheduleJob = (cronExpression: string, jobFunction: () => Promise<void>, jobName: string) => {
  cron.schedule(cronExpression, async () => {
    try {
      logger.info(`${jobName} - Job started`);
      await jobFunction();
      logger.info(`${jobName} - Job completed successfully`);
    } catch (error) {
      logger.error(`${jobName} - Job failed:`, error);
    }
  });
};
