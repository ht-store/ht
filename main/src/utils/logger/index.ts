import winston from "winston";

const customColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "blue",
};

winston.addColors(customColors);

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: "HH:mm:ss",
    }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${level.toUpperCase()}] ${timestamp}: ${message}`;
    }),
    winston.format.colorize({ all: true })
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
