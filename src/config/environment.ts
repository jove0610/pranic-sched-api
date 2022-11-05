export interface EnvConfig {
  database: {
    mongoURI: string;
    jwtSecret: string;
    jwtExpiresIn: string;
  };
}

export default () => ({
  database: {
    mongoURI: process.env.MONGO_URI || '',
    jwtSecret: process.env.JWT_SECRET || '',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '60s',
  },
});
