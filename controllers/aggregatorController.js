//controllers/aggregatorController.js
class AggregatorController {
  constructor(aggregatorService) {
    this.aggregatorService = aggregatorService;
  }

  getTariffsByDistrictId = async (req, res) => {
    try {
      const tariffs = await this.aggregatorService.getTariffsByDistrictId(
        req.params.id
      );
      res.status(200).json(tariffs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getProvidersByDistrictId = async (req, res) => {
    try {
      const providers = await this.aggregatorService.getProvidersByDistrictId(
        req.params.id
      );
      res.status(200).json(providers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getTariffsByHouse = async (req, res) => {
    try {
      const tariffs = await this.aggregatorService.getTariffsByHouse(
        req.params.id
      );
      res.status(200).json(tariffs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getProvidersByHouse = async (req, res) => {
    try {
      const providers = await this.aggregatorService.getProvidersByHouse(
        req.params.id
      );
      res.status(200).json(providers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getFullInfoByHouse = async (req, res) => {
    try {
      const tariffs = await this.aggregatorService.getTariffsByHouse(
        req.params.id
      );
      const providers = await this.aggregatorService.getProvidersByHouse(
        req.params.id
      );
      res.status(200).json({ tariffs, providers });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

export default AggregatorController;
