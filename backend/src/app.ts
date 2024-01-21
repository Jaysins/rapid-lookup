import 'express-async-errors';
import express, { type Express, type Request, type Response } from 'express';

import cors from 'cors';
import helmet from 'helmet';

import { config } from './config';
import logger from './shared/utils/logger';
import routes from './routes';
import { connectToDatabase } from './shared/utils/db';
import errorHandlerMiddleware from './middlewares/errorHandler';
import { scheduleJob } from './shared/utils/cron';
import { scheduleCronJobs } from './tasks';

const app: Express = express();
const port = config.server.port;
const basePath = config.server.base_path;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.get(`${basePath}/home/intro`, (_req: Request, res: Response) => {
  res.send('Welcome to Handyman API');
});

app.use(routes);

// Use your custom error handler middleware
app.use(errorHandlerMiddleware);

connectToDatabase().then(() => {
  scheduleCronJobs()
  app.listen(port, () => {
    logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
});
