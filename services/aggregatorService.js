//services/aggregatorService.js
import crypto from "crypto";

class AggregatorService {
  constructor(aggregatorModel) {
    this.aggregatorModel = aggregatorModel;
  }

  async hashAddress(address) {
    const hash = crypto.createHash("md5").update(address).digest("hex");
    return hash;
  }

  async getProvidersOnAddress(address) {
    const hashAddress = await this.hashAddress(address);
    const providers = await this.aggregatorModel.getProvidersOnAddress(
      hashAddress
    );
    const arrProvidersId = providers.map((item) => item.provider_id);
    return arrProvidersId;
  }

  // Старые методы
  // async getTariffsByDistrictId(id_district) {
  //   return this.aggregatorModel.getTariffsByDistrictId(id_district);
  // }
  // async getProvidersByDistrictId(id_district) {
  //   return this.aggregatorModel.getProvidersByDistrictId(id_district);
  // }
  // async getTariffsByHouse(id_house) {
  //   return this.aggregatorModel.getTariffsByHouse(id_house);
  // }
  // async getProvidersByHouse(id_house) {
  //   return this.aggregatorModel.getProvidersByHouse(id_house);
  // }
  // async getFullInfoByHouse(id_house) {
  //   return this.aggregatorModel.getFullInfoByHouse(id_house);
  // }
  // async getDistrictName(id) {
  //   return this.aggregatorModel.getDistrictName(id);
  // }
  // async getTariffsByEngName(engName) {
  //   return this.aggregatorModel.getTariffsByEngName(engName);
  // }
  // async getProvidersByEngName(engName) {
  //   return this.aggregatorModel.getProvidersByEngName(engName);
  // }
  // async getInfoDistrictByEngName(engName) {
  //   return this.aggregatorModel.getInfoDistrictByEngName(engName);
  // }
  // async getCityName(id) {
  //   return this.aggregatorModel.getCityName(id);
  // }
  // async getTariff(id) {
  //   return this.aggregatorModel.getTariff(id);
  // }
  // async getTariffsByDistrictAndProvider(districtId, providerId) {
  //   return this.aggregatorModel.getTariffsByDistrictAndProvider(
  //     districtId,
  //     providerId
  //   );
  // }
}

export default AggregatorService;
