require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_DEVELOPMENT,
    host: process.env.HOST,
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_TEST,
    host: process.env.HOST,
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_PRODUCTION,
    host: process.env.HOST,
    dialect: "mysql",
  },
};
