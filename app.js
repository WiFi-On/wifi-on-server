import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import AggregatorModel from "./models/aggregatorModel.js";
import AggregatorService from "./services/aggregatorService.js";
import ExcelTcService from "./services/excelTcService.js";
import AggregatorController from "./controllers/aggregatorController.js";
import aggregatorRoutes from "./routes/aggregatorRoutes.js";
import cors from "cors";
import logger from "./config/logger.js";
import { format } from "date-fns";
import checkAPIKey from "./middleware/checkApiKey.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Определение __dirname для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = connectDB();

const aggregatorModel = new AggregatorModel();
const aggregatorService = new AggregatorService(aggregatorModel);
const excelTcService = new ExcelTcService(aggregatorModel);
const aggregatorController = new AggregatorController(
  aggregatorService,
  excelTcService
);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(checkAPIKey);

// Настройка morgan для логирования
// app.use(
//   morgan(
//     (tokens, req, res) => {
//       const logObject = {
//         ip: tokens["remote-addr"](req, res),
//         date: format(
//           new Date(tokens.date(req, res, "iso")),
//           "yyyy-MM-dd HH:mm:ss"
//         ),
//         method: tokens.method(req, res),
//         url: tokens.url(req, res),
//         status: tokens.status(req, res),
//         response_time: tokens["response-time"](req, res) + " ms",
//         content_length: tokens.res(req, res, "content-length"),
//       };

//       // Добавляем сообщение об ошибке, если статус код 400 и выше
//       if (tokens.status(req, res) >= 400) {
//         logObject.message = res.locals.errorMessage || "Client error";
//       }

//       return JSON.stringify(logObject);
//     },
//     {
//       stream: {
//         write: (message) => {
//           logger.info(message.trim());
//         },
//       },
//     }
//   )
// );

// Настройка хранилища для загруженных файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Форматирование текущей даты
    const formattedDate = format(new Date(), "yyyyMMdd-HHmmss");
    // Использование отформатированной даты в имени файла
    cb(null, `input-${formattedDate}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

// Routes
app.use("/api/v1", aggregatorRoutes(aggregatorController, upload));

// // Error handling middleware
// app.use((err, req, res, next) => {
//   // Добавляем информацию об ошибке в response.locals для morgan
//   res.locals.errorMessage = err.message;

//   // Записываем ошибку в лог
//   logger.error({
//     message: err.message,
//     stack: err.stack,
//     url: req.originalUrl,
//     method: req.method,
//     body: req.body,
//   });

//   // Отправляем ответ клиенту
//   res.status(err.status || 500).send("Что-то пошло не так!");
// });

const port = process.env.PORT || 5000;
app.listen(port, () => logger.info(`Сервер запущен на порту ${port}`));
