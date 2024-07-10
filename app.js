//app.js
import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import AggregatorModel from "./models/aggregatorModel.js";
import AggregatorService from "./services/aggregatorService.js";
import AggregatorController from "./controllers/aggregatorController.js";
import aggregatorRoutes from "./routes/aggregatorRoutes.js";
import cors from "cors";

const db = connectDB();

const aggregatorModel = new AggregatorModel();
const aggregatorService = new AggregatorService(aggregatorModel);
const aggregatorController = new AggregatorController(aggregatorService);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api/v1", aggregatorRoutes(aggregatorController));

const port = process.env.PORT || 5014;
app.listen(port, () => console.log(`Сервер запущен на порту ${port}`));
