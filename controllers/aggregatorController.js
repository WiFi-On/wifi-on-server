//controllers/aggregatorController.js
import archiver from "archiver";
import fs from "fs";
import path from "path";
class AggregatorController {
  constructor(aggregatorService, excelTcService) {
    this.aggregatorService = aggregatorService;
    this.excelTcService = excelTcService;
  }

  // Контроллер получения провайдеров по адресу
  getProvidersOnAddress = async (req, res) => {
    try {
      const providers = await this.aggregatorService.getProvidersOnAddress(
        req.params.address
      );
      res.status(200).json({ providers: providers });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getTariffsOnAddress = async (req, res) => {
    try {
      const tariffs = await this.aggregatorService.getTariffsOnAddress(
        req.params.address
      );
      res.status(200).json({ tariffs: tariffs });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getIpAndCity = async (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    try {
      const ipAndCity = await this.aggregatorService.getIpAndCity(ip);
      res.status(200).json({ engName: ipAndCity });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getFullInfoDistrictByEndName = async (req, res) => {
    try {
      const fullInfoDistrict =
        await this.aggregatorService.getDistrictInfoByEngName(
          req.params.engNameDistrict
        );

      const tariffs = await this.aggregatorService.getTariffsByDistrictEngName(
        req.params.engNameDistrict
      );

      const providers =
        await this.aggregatorService.getProvidersByDistrictEngName(
          req.params.engNameDistrict
        );

      res.status(200).json({
        infoDistrict: fullInfoDistrict,
        tariffs: tariffs,
        providers: providers,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getTariff = async (req, res) => {
    try {
      const tariff = await this.aggregatorService.getTariff(req.params.id);
      res.status(200).json({ tariff: tariff });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getAllCitiesEngName = async (req, res) => {
    try {
      const cities = await this.aggregatorService.getAllCitiesEndName();
      res.status(200).json({ cities: cities });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getTariffsOnDistrict = async (req, res) => {
    try {
      const tariffs = await this.aggregatorService.getTariffsByDistrictEngName(
        req.params.district
      );
      res.status(200).json({ tariffs: tariffs });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getTariffsOnAddressByHash = async (req, res) => {
    try {
      const tariffs = await this.aggregatorService.getTariffsOnAddressByHash(
        req.params.address
      );
      res.status(200).json({ tariffs: tariffs });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getTariffsAndProvidersOnAddressByHash = async (req, res) => {
    try {
      const tariffsAndProviders =
        await this.aggregatorService.getTariffsAndProvidersOnAddressByHash(
          req.params.hashAddress
        );
      res.status(200).json(tariffsAndProviders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  uploadExcel = async (req, res) => {
    // Проверяем, что файл загружен
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    try {
      const archiveBuffer = await this.excelTcService.excelTc(req.file.path);
      res.setHeader("Content-Disposition", "attachment; filename=archive.zip");
      res.setHeader("Content-Type", "application/zip");
      res.send(archiveBuffer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
export default AggregatorController;
