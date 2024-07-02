//routes/aggregatorRoutes.js
import express from "express";

const createRouter = (aggregatorControllerV2) => {
  const router = express.Router();

  router.get(
    "/providersOnAddress/:address",
    aggregatorControllerV2.getTariffsByDistrictId
  );

  return router;
};

export default createRouter;
