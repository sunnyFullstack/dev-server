const chalk = require("chalk");

const getTime = () => new Date().toISOString();

const logger = {
  info: (message) => {
    if (process.env.NODE_ENV !== "production") {
      printLog(chalk.bgGreen, "INFO", message);
    }
  },
  warn: (message) => {
    if (process.env.NODE_ENV !== "production") {
      printLog(chalk.bgYellow, "WARN", message);
    }
  },
  error: (message) => {
    if (process.env.NODE_ENV !== "production") {
      printLog(chalk.bgRed, "ERROR", message);
    }
  },
  debug: (message) => {
    if (process.env.NODE_ENV !== "production") {
      printLog(chalk.bgGrey, "DEBUG", message);
    }
  },
};
function printLog(colorCode, key, msg) {
  cl = colorCode;
  console.log(
    `${colorCode(key)} ${chalk.underline(getTime())} - ${colorCode(msg)}`
  );
}
module.exports = logger;
