import { ConfigFactory } from '@nestjs/config';

const envConfig: ConfigFactory = () => ({
  app: {
    jwtSecret: process.env.MONGO_URI,
  },
  auth: {
    accessTokenExpiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN || ''),
  },
  database: {
    uri: process.env.MONGO_URI || '',
  },
});

export default envConfig;
