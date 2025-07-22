// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   host: process.env.PGHOST,
//   user: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   database: process.env.PGDATABASE,
//   port: process.env.PGPORT,
// });

// pool.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database", err.stack);
//   } else {
//     console.log("Connected to the database");
//   }
// });

// module.exports = pool;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("../utils/logger");
const { MESSAGES } = require("../utils/constants");

dotenv.config();

const { db_username, db_password, MONGO_URI } = process.env;

// Replace placeholders in URI
const mongodb_uri = MONGO_URI.replace("<username>", db_username).replace(
  "<password>",
  db_password
);

const connectDB = async () => {
  try {
    await mongoose.connect(mongodb_uri, { autoIndex: false });
    logger.info(`✅ ${MESSAGES.MONGODD_CONNECT} `);
  } catch (error) {
    logger.error(`❌ ${MESSAGES.MONGO_FAILLED}`, error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
