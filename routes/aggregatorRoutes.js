//routes/aggregatorRoutes.js
import express from "express";

const createRouter = (aggregatorController) => {
  const router = express.Router();

  // Получение провайдеров по адресу
  router.get(
    "/providersOnAddress/:address",
    aggregatorController.getProvidersOnAddress
  );

  // Старые пути
  // router.get(
  //   "/tariffsByDistrict/:id",
  //   aggregatorController.getTariffsByDistrictId
  // );
  // router.get(
  //   "/providersByDistrict/:id",
  //   aggregatorController.getProvidersByDistrictId
  // );
  // router.get("/getDistrictName/:id", aggregatorController.getDistrictName);
  // router.get("/tariffsByHouse/:id", aggregatorController.getTariffsByHouse);
  // router.get("/providersByHouse/:id", aggregatorController.getProvidersByHouse);
  // router.get("/fullInfoByHouse/:id", aggregatorController.getFullInfoByHouse);
  // router.get(
  //   "/fullInfoByDistrict/:id",
  //   aggregatorController.getFullInfoByDistrict
  // );
  // router.get(
  //   "/fullInfoDistrictByEndName/:id",
  //   aggregatorController.getFullInfoDistrictByEndName
  // );
  // router.get("/getCityName/:id", aggregatorController.getCityName);
  // router.get("/getTariff/:id", aggregatorController.getTariff);
  // router.get("/getIpAndCity", aggregatorController.getIpAndCity);

  return router;
};

export default createRouter;
