//app.js
import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import AggregatorModel from "./models/aggregatorModel.js";
import AggregatorService from "./services/aggregatorService.js";
import AggregatorController from "./controllers/aggregatorController.js";
import AggregatorControllerV2 from "./controllers/aggregatorControllerV2.js";
import aggregatorRoutes from "./routes/aggregatorRoutes.js";
import aggregatorRoutesV2 from "./routes/aggregatorRoutesV2.js";
import cors from "cors";

const db = connectDB();

const aggregatorModel = new AggregatorModel();
const aggregatorService = new AggregatorService(aggregatorModel);
const aggregatorController = new AggregatorController(aggregatorService);
const aggregatorControllerV2 = new AggregatorControllerV2(aggregatorService);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api", aggregatorRoutes(aggregatorController));
app.use("/api/v2", aggregatorRoutesV2(aggregatorControllerV2));

const port = process.env.PORT || 5031;
app.listen(port, () => console.log(`Сервер запущен на порту ${port}`));
