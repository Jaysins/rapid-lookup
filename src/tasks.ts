import { scheduleJob } from './shared/utils/cron';
import { updateRecentCatalog } from './services/catalogue';

export const scheduleCronJobs = () => {

    scheduleJob('* 1 * * *', updateRecentCatalog, 'Update Recent Catalog');
    // Add more jobs as needed
};
