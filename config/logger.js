import winston from "winston";
import { format } from "date-fns";

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp }) => {
    let logMessage = message;
    try {
      const parsedMessage = JSON.parse(message);
      logMessage = JSON.stringify(parsedMessage, null, 2);
    } catch (error) {
      // message is not a valid JSON
    }
    const formattedTimestamp = format(
      new Date(timestamp),
      "yyyy-MM-dd HH:mm:ss"
    );
    return `${formattedTimestamp} ${level}: ${logMessage}`;
  })
);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

export default logger;
