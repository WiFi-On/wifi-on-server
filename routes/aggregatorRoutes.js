import express from "express";

const createRouter = (aggregatorController, upload) => {
  const router = express.Router();

  // Получение провайдеров по адресу
  router.get(
    "/providersOnAddress/:address",
    aggregatorController.getProvidersOnAddress
  );
  // Получение тарифов по адресу(адрес должен быть типизирован через dadata(value))
  router.get(
    "/tariffsOnAddress/:address",
    aggregatorController.getTariffsOnAddress
  );
  // Получение тарифов по хэшу адреса(адрес должен быть типизирован через dadata(value))
  router.get(
    "/tariffsOnAddressByHash/:hashAddress",
    aggregatorController.getTariffsOnAddressByHash
  );
  // Получение тарифов и провайдеров по хэшу адреса(адрес должен быть типизирован через dadata(value))
  router.get(
    "/tariffsAndProvidersOnAddressByHash/:hashAddress",
    aggregatorController.getTariffsAndProvidersOnAddressByHash
  );
  router.get(
    "/infoDistrictByEngName/:engName",
    aggregatorController.getDistrictInfoByEngName
  );
  // Получение информации населенного пункта по ip
  router.get("/ipAndCity", aggregatorController.getIpAndCity);
  // Получение названия английского населенного пункта по fiasID
  router.get(
    "/engNameDistrictByFiasId/:fiasId",
    aggregatorController.getEngNameDistrictByFiasId
  );
  // Получение информации о населенном пункте, тарифов и провайдеров по английскому названию населенного пункта
  router.get(
    "/fullInfoDistrictByEndName/:engNameDistrict",
    aggregatorController.getFullInfoDistrictByEndName
  );
  // Получение тарифов по английскому названию населенного пункта
  router.get(
    "/tarrifsOnDistrict/:engNameDistrict",
    aggregatorController.getTariffsOnDistrict
  );
  // Получение информации о тарифе по id
  router.get("/tariff/:id", aggregatorController.getTariff);
  // Получение всех населенных пунктов на английском
  router.get("/allCitiesEngName", aggregatorController.getAllCitiesEngName);
  // Маршрут для загрузки Excel файла
  router.post(
    "/excelTc",
    upload.single("excelFile"),
    aggregatorController.uploadExcel
  );

  return router;
};

export default createRouter;
