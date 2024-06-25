//services/aggregatorService.js
class AggregatorService {
  constructor(aggregatorModel) {
    this.aggregatorModel = aggregatorModel;
  }

  async getTariffsByDistrictId(id_district) {
    return this.aggregatorModel.getTariffsByDistrictId(id_district);
  }

  async getProvidersByDistrictId(id_district) {
    return this.aggregatorModel.getProvidersByDistrictId(id_district);
  }

  async getTariffsByHouse(id_house) {
    return this.aggregatorModel.getTariffsByHouse(id_house);
  }

  async getProvidersByHouse(id_house) {
    return this.aggregatorModel.getProvidersByHouse(id_house);
  }

  async getFullInfoByHouse(id_house) {
    return this.aggregatorModel.getFullInfoByHouse(id_house);
  }

  async getDistrictName(id) {
    return this.aggregatorModel.getDistrictName(id);
  }

  async getTariffsByEngName(engName) {
    return this.aggregatorModel.getTariffsByEngName(engName);
  }

  async getProvidersByEngName(engName) {
    return this.aggregatorModel.getProvidersByEngName(engName);
  }

  async getInfoDistrictByEngName(engName) {
    return this.aggregatorModel.getInfoDistrictByEngName(engName);
  }
}

export default AggregatorService;
