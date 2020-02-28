const env = require('./environment');

const appEnvironment = env.NODE_ENV;

const config = {
  [appEnvironment]: {
    url: env.DATABASE_URL,
    dialect: env.DATABASE_DIALECT || 'postgres',
    logging: false,
    use_env_variable: 'DATABASE_URL',
  },
};

module.exports = config;
