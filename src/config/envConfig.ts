import { ConfigFactory } from '@nestjs/config';

const envConfig: ConfigFactory = () => ({
  database: {
    uri: process.env.MONGO_URI || '',
  },
});

export default envConfig;
