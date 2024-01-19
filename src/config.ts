import dotenv from 'dotenv';
import * as process from 'process';

dotenv.config(); // Load environment variables from .env file

export const config = {

  server: {
    port: process.env.PORT ?? 3000,
    base_path: process.env.BASE_PATH ?? '',
  },
  database: {
    url: process.env.DATABASE_URL ?? 'mongodb://localhost:27017/basal',
  },

  integration: {
    rapid_api_key: process.env.RAPID_API_KEY,
    rapid_api_geo_host: process.env.RAPID_API_GEO_HOST,
    rapid_api_news_host: process.env.RAPID_API_NEWS_HOST,
    rapid_api_geo_url: process.env.RAPID_API_GEO_URL,
    rapid_api_news_url: process.env.RAPID_API_NEWS_URL
  },

}
