export interface EnvConfig {
  database: {
    mongoURI: string;
  };
}

export default () => ({
  database: {
    mongoURI: process.env.MONGO_URI || '',
  },
});
