//services/aggregatorService.js
import crypto from "crypto";

class AggregatorService {
  constructor(aggregatorModel) {
    this.aggregatorModel = aggregatorModel;
    this.apiKeyDadata = "71378de14318d10009285e018aedbfe5a353bb5a";
    this.providerNameById = {
      1: "Русская компания",
      2: "МТС",
      3: "МегаФон",
    };
  }

  async hashAddress(address) {
    const hash = crypto.createHash("md5").update(address).digest("hex");
    return hash;
  }

  async getIpFromData(ip) {
    try {
      const dadataResponse = await fetch(
        "http://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Token ${this.apiKeyDadata}`,
          },
          body: JSON.stringify({ ip: ip }),
        }
      );

      if (!dadataResponse.ok) {
        throw new Error(`DaData API error: ${dadataResponse.statusText}`);
      }

      const dadataData = await dadataResponse.json();
      console.log(dadataData);
      // Проверяем, получили ли мы корректные данные
      if (!dadataData || !dadataData.location || !dadataData.location.data) {
        throw new Error("Invalid data received from DaData");
      }

      const cityFiasId = dadataData.location.data.city_fias_id;

      return cityFiasId;
    } catch (error) {
      console.error("Error:", error.message);
      return {
        error: "Failed to fetch data",
        details: error.message,
      };
    }
  }

  async getProvidersOnAddress(address) {
    const hashAddress = await this.hashAddress(address);
    const providers = await this.aggregatorModel.getProvidersOnAddress(
      hashAddress
    );
    const resultProviders = providers.map((provider) => ({
      id: provider.provider_id,
      name: this.providerNameById[provider.provider_id],
    }));
    return resultProviders;
  }

  async getTariffsOnAddress(address) {
    const hashAddress = await this.hashAddress(address);
    const tariffs = await this.aggregatorModel.getTariffsOnAddress(hashAddress);
    const resultTariffs = tariffs.map((tariff) => {
      const { provider_id, ...rest } = tariff;
      return {
        ...rest,
        provider: {
          id: provider_id,
          name: this.providerNameById[provider_id],
        },
      };
    });
    return resultTariffs;
  }

  async getIpAndCity(ip) {
    const ipFromData = await this.getIpFromData(ip);
    const cityData = await this.aggregatorModel.getIpAndCity(ipFromData);

    return cityData;
  }

  async getDistrictInfoByEngName(engName) {
    const districtData = await this.aggregatorModel.getDistrictInfoByEngName(
      engName
    );
    const resultDistrictData = districtData[0];
    return resultDistrictData;
  }

  async getTariffsByDistrictEngName(engName) {
    const fiasDistrictId =
      await this.aggregatorModel.getDistrictFiasIdByEngName(engName);

    const tariffs = await this.aggregatorModel.getTariffsByDistrictFiasId(
      fiasDistrictId[0].id
    );
    const resultTariffs = tariffs.map((tariff) => {
      const { provider_id, ...rest } = tariff;
      return {
        ...rest,
        provider: {
          id: provider_id,
          name: this.providerNameById[provider_id],
        },
      };
    });
    return resultTariffs;
  }

  async getProvidersByDistrictEngName(engName) {
    const fiasDistrictId =
      await this.aggregatorModel.getDistrictFiasIdByEngName(engName);
    const providers = await this.aggregatorModel.getProvidersByDistrictFiasId(
      fiasDistrictId[0].id
    );

    const resultProviders = providers.map((provider) => ({
      id: provider.provider_id,
      name: this.providerNameById[provider.provider_id],
    }));
    return resultProviders;
  }

  async getTariff(id) {
    const [tariff] = await this.aggregatorModel.getTariff(id);
    const { provider_id, ...rest } = tariff;
    return {
      ...rest,
      provider: {
        id: provider_id,
        name: this.providerNameById[provider_id],
      },
    };
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
