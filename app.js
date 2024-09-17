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

const port = process.env.PORT || 5000;
app.listen(port, () => logger.info(`Сервер запущен на порту ${port}`));
