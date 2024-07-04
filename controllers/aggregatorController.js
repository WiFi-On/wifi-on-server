//controllers/aggregatorController.js
class AggregatorController {
  constructor(aggregatorService) {
    this.aggregatorService = aggregatorService;
    this.nameAndImageProviders = {
      1: { id: 1, name: "МТС", img: "mts.svg" },
      2: { id: 2, name: "Русская компания", img: "ruscom.svg" },
      3: { id: 3, name: "Билайн", img: "beeline.svg" },
      4: { id: 4, name: "Мегафон", img: "megafon.svg" },
      5: { id: 5, name: "Алматель", img: "almatel.svg" },
      6: { id: 6, name: "АБВ", img: "abv.svg" },
      7: { id: 7, name: "Ростелеком", img: "rtk.svg" },
      8: { id: 8, name: "Дом.ру", img: "domru.svg" },
      9: { id: 9, name: "Сибирский медведь", img: "sibMedved.svg" },
    };
    this.apiKeyDadata = "bbbdb08051ba3df93014d80a721660db6c19f0db";
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
      let tariffs = await this.aggregatorService.getTariffsByHouse(
        req.params.id
      );
      const tariffsRtk =
        await this.aggregatorService.getTariffsByDistrictAndProvider(
          7200000100000,
          7
        );
      let providers = await this.aggregatorService.getProvidersByHouse(
        req.params.id
      );

      if (!tariffs.some((tariff) => tariff.provider_id === 7)) {
        providers.push(this.nameAndImageProviders[7]);
        tariffs = tariffs.concat(tariffsRtk);
      }

      tariffs.forEach((tariff) => {
        const nameAndImageProviders = {
          1: { id: 1, name: "МТС", img: "mts.svg" },
          2: { id: 2, name: "Русская компания", img: "ruscom.svg" },
          3: { id: 3, name: "Билайн", img: "beeline.svg" },
          4: { id: 4, name: "Мегафон", img: "megafon.svg" },
          5: { id: 5, name: "Алматель", img: "almatel.svg" },
          6: { id: 6, name: "АБВ", img: "abv.svg" },
          7: { id: 7, name: "Ростелеком", img: "rtk.svg" },
          8: { id: 8, name: "Дом.ру", img: "domru.svg" },
          9: { id: 9, name: "Сибирский медведь", img: "sibMedved.svg" },
        };
        tariff.provider = nameAndImageProviders[tariff.provider_id];

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
      const tariffsRtk =
        await this.aggregatorService.getTariffsByDistrictAndProvider(
          7200000100000,
          7
        );
      const providers = await this.aggregatorService.getProvidersByEngName(
        req.params.id
      );
      const districtName =
        await this.aggregatorService.getInfoDistrictByEngName(req.params.id);
      console.log(providers);
      if (!tariffs.some((tariff) => tariff.provider_id === 7)) {
        tariffs = tariffs.concat(tariffsRtk);
        providers.push({ provider_id: 7 });
      }

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

      let resultProviders = [];
      const providerIds = providers.map((row) => row.provider_id);
      providerIds.forEach((providerId) => {
        if (this.nameAndImageProviders[providerId]) {
          resultProviders.push(this.nameAndImageProviders[providerId]);
        }
      });
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

  getTariff = async (req, res) => {
    try {
      const tariff = await this.aggregatorService.getTariff(req.params.id);

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
      res.status(200).json({ tariff });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getIpAndCity = async (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log(ip);
    try {
      // Запрос к DaData для получения информации о местоположении по IP
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

      const cityKladrId = dadataData.location.data.city_kladr_id;

      const cityData = await this.aggregatorService.getCityName(cityKladrId);

      // Проверяем, получили ли мы корректные данные
      if (!cityData) {
        throw new Error("Invalid data received from local API");
      }

      // Отправляем имя города в ответ
      res.status(200).json({ city: cityName });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({
        error: "Failed to fetch data",
        details: error.message,
      });
    }
  };
}
export default AggregatorController;
