//controllers/aggregatorController.js
class AggregatorController {
  constructor(aggregatorService) {
    this.aggregatorService = aggregatorService;
    this.nameAndImageProviders = {
      1: { id: 1, name: "МТС", img: "mts.png" },
      2: { id: 2, name: "Русская компания", img: "ruscom.png" },
      3: { id: 3, name: "Билайн", img: "beeline.png" },
      4: { id: 4, name: "Мегафон", img: "megafon.png" },
      5: { id: 5, name: "Алматель", img: "almatel.png" },
      6: { id: 6, name: "АБВ", img: "abv.png" },
      7: { id: 7, name: "Ростелеком", img: "rtk.png" },
      8: { id: 8, name: "Дом.ру", img: "domru.png" },
      9: { id: 9, name: "Сибирский медведь", img: "sibMedved.png" },
    };
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

  getDistrictName = async (req, res) => {
    try {
      const cityName = await this.aggregatorService.getDistrictName(
        req.params.id
      );
      res.status(200).json(cityName);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getFullInfoByDistrict = async (req, res) => {
    try {
      const tariffs = await this.aggregatorService.getTariffsByDistrictId(
        req.params.id
      );
      tariffs.forEach((tariff) => {
        tariff.provider = this.nameAndImageProviders[tariff.provider_id];

        const cardparams = [];
        if (tariff.internet_speed) {
          cardparams.push({
            img: "iconInternet.svg",
            name: "Домашний интернет",
            params: [
              {
                name: "Скорость",
                value: `${tariff.internet_speed}`,
                value_type: "Мбит/с",
              },
            ],
          });
        }
        if (tariff.channels_count) {
          cardparams.push({
            img: "iconTv.svg",
            name: "ТВ",
            params: [
              {
                name: "Кол-во каналов",
                value: `${tariff.channels_count}`,
              },
            ],
          });
        }
        if (tariff.minutes) {
          cardparams.push({
            img: "iconMob.svg",
            name: "Мобильная связь",
            params: [
              {
                name: "Минуты",
                value: `${tariff.minutes}`,
                value_type: "Мин.",
              },
            ],
          });
        }
        if (tariff.router_rent) {
          cardparams.push({
            img: "iconWifi.svg",
            name: "Wi-Fi Роутер",
            params: [
              {
                name: "В аренду",
                value: `${tariff.router_rent}`,
                value_type: "₽/мес.",
              },
            ],
          });
        }
        if (tariff.tv_box_rent) {
          cardparams.push({
            img: "iconDecoder.svg",
            name: "ТВ приставка",
            params: [
              {
                name: "В аренду",
                value: `${tariff.tv_box_rent}`,
                value_type: "₽/мес.",
              },
            ],
          });
        }

        tariff.cardparams = cardparams;
      });

      const providers = await this.aggregatorService.getProvidersByDistrictId(
        req.params.id
      );
      let resultProviders = [];
      const providerIds = providers.map((row) => row.provider_id);
      providerIds.forEach((providerId) => {
        if (this.nameAndImageProviders[providerId]) {
          resultProviders.push(this.nameAndImageProviders[providerId]);
        }
      });

      res.status(200).json({ tariffs, providers: resultProviders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getFullInfoDistrictByEndName = async (req, res) => {
    try {
      let tariffs = await this.aggregatorService.getTariffsByEngName(
        req.params.id
      );

      tariffs.forEach((tariff) => {
        tariff.provider = this.nameAndImageProviders[tariff.provider_id];

        const cardparams = [];
        if (tariff.internet_speed) {
          cardparams.push({
            img: "iconInternet.svg",
            name: "Домашний интернет",
            params: [
              {
                name: "Скорость",
                value: `${tariff.internet_speed}`,
                value_type: "Мбит/с",
              },
            ],
          });
        }
        if (tariff.channels_count) {
          cardparams.push({
            img: "iconTv.svg",
            name: "ТВ",
            params: [
              {
                name: "Кол-во каналов",
                value: `${tariff.channels_count}`,
              },
            ],
          });
        }
        if (tariff.minutes) {
          cardparams.push({
            img: "iconMob.svg",
            name: "Мобильная связь",
            params: [
              {
                name: "Минуты",
                value: `${tariff.minutes}`,
                value_type: "Мин.",
              },
            ],
          });
        }
        if (tariff.router_rent) {
          cardparams.push({
            img: "iconWifi.svg",
            name: "Wi-Fi Роутер",
            params: [
              {
                name: "В аренду",
                value: `${tariff.router_rent}`,
                value_type: "₽/мес.",
              },
            ],
          });
        }
        if (tariff.tv_box_rent) {
          cardparams.push({
            img: "iconDecoder.svg",
            name: "ТВ приставка",
            params: [
              {
                name: "В аренду",
                value: `${tariff.tv_box_rent}`,
                value_type: "₽/мес.",
              },
            ],
          });
        }

        tariff.cardparams = cardparams;
      });

      const providers = await this.aggregatorService.getProvidersByEngName(
        req.params.id
      );
      let resultProviders = [];
      const providerIds = providers.map((row) => row.provider_id);
      providerIds.forEach((providerId) => {
        if (this.nameAndImageProviders[providerId]) {
          resultProviders.push(this.nameAndImageProviders[providerId]);
        }
      });

      const districtName =
        await this.aggregatorService.getInfoDistrictByEngName(req.params.id);

      res
        .status(200)
        .json({ districtName, tariffs, providers: resultProviders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getCityName = async (req, res) => {
    try {
      const cityName = await this.aggregatorService.getCityName(req.params.id);
      res.status(200).json({ cityName });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
export default AggregatorController;
