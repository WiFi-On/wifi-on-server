import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import AggregatorModel from "./models/aggregatorModel.js";
import AggregatorService from "./services/aggregatorService.js";
import AggregatorController from "./controllers/aggregatorController.js";
import aggregatorRoutes from "./routes/aggregatorRoutes.js";
import cors from "cors";
import logger from "./config/logger.js";
import morgan from "morgan";
import { format } from "date-fns";
import checkAPIKey from "./middleware/checkApiKey.js";

const db = connectDB();

const aggregatorModel = new AggregatorModel();
const aggregatorService = new AggregatorService(aggregatorModel);
const aggregatorController = new AggregatorController(aggregatorService);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(checkAPIKey);
app.use(
  morgan(
    (tokens, req, res) => {
      const logObject = {
        ip: tokens["remote-addr"](req, res),
        date: format(
          new Date(tokens.date(req, res, "iso")),
          "yyyy-MM-dd HH:mm:ss"
        ),
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        response_time: tokens["response-time"](req, res) + " ms",
      };
      return JSON.stringify(logObject);
    },
    {
      stream: {
        write: (message) => {
          logger.info(message.trim());
        },
      },
    }
  )
);

// Routes
app.use("/api/v1", aggregatorRoutes(aggregatorController));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Что-то пошло не так!");
});

const port = process.env.PORT || 5003;
app.listen(port, () => logger.info(`Сервер запущен на порту ${port}`));
