// models/aggregatorModel.js
import connectDB from "../config/db.js";
const db = connectDB();

class AggregatorModel {
  constructor() {
    this.tariffsTable = "tariffs";
    this.streetsTable = "streets";
    this.districtsTable = "districts";
  }

  async getTariffsByDistrictId(districtId) {
    try {
      const tariffs = await db(this.tariffsTable)
        .select(`*`)
        .where(`district_id`, districtId);

      return tariffs;
    } catch (error) {
      throw new Error(
        `Ошибка при получении тарифов по населенному пункту: ${error.message}`
      );
    }
  }
  async getProvidersByDistrictId(districtId) {
    try {
      const providers = await db(this.tariffsTable)
        .distinct("provider_id")
        .where("district_id", districtId);

      return providers;
    } catch (error) {
      throw new Error(
        `Ошибка при получении провайдеров по населенному пункту: ${error.message}`
      );
    }
  }
  async getTariffsByHouse(houseId) {
    try {
      const tariffs = await db("streets as h")
        .join("providersonstreet as pos", "h.id", "pos.street_id")
        .join("tariffs as t", function () {
          this.on("h.districtid", "=", "t.district_id").andOn(
            "pos.provider_id",
            "=",
            "t.provider_id"
          );
        })
        .select("t.*")
        .where("h.id", houseId);

      return tariffs;
    } catch (error) {
      throw new Error(`Ошибка при получении тарифов по дому: ${error.message}`);
    }
  }
  async getProvidersByHouse(houseId) {
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
    const result = [];

    try {
      // Запрос для получения уникальных provider_id
      const providers = await db("streets as h")
        .join("providersonstreet as pos", "h.id", "pos.street_id")
        .join("tariffs as t", function () {
          this.on("h.districtid", "=", "t.district_id").andOn(
            "pos.provider_id",
            "=",
            "t.provider_id"
          );
        })
        .distinct("t.provider_id")
        .where("h.id", houseId);

      // Преобразуем providers в массив provider_id
      const providerIds = providers.map((row) => row.provider_id);

      // Для каждого provider_id добавляем соответствующий объект из nameAndImageProviders в результат
      providerIds.forEach((providerId) => {
        if (nameAndImageProviders[providerId]) {
          result.push(nameAndImageProviders[providerId]);
        }
      });

      return result;
    } catch (error) {
      throw new Error(
        `Ошибка при получении уникальных provider_id: ${error.message}`
      );
    }
  }
  async getDistrictName(id) {
    try {
      const city = await db("districts")
        .select("*")
        .where("engname", id)
        .first();
      return city;
    } catch (error) {
      throw new Error(`Ошибка при получении города: ${error.message}`);
    }
  }
  async getProvidersByEngName(engName) {
    try {
      const providers = await db("tariffs")
        .select("provider_id")
        .distinct()
        .join("districts", "tariffs.district_id", "districts.id")
        .where("districts.engname", engName);

      return providers;
    } catch (error) {
      throw new Error(`Ошибка при получении города: ${error.message}`);
    }
  }
  async getTariffsByEngName(engName) {
    try {
      const tariffs = await db("tariffs")
        .select("tariffs.*")
        .join("districts", "tariffs.district_id", "districts.id")
        .where("districts.engname", engName);
      return tariffs;
    } catch (error) {
      throw new Error(`Ошибка при получении города: ${error.message}`);
    }
  }
  async getInfoDistrictByEngName(engName) {
    try {
      const city = await db("districts")
        .select("*")
        .where("engname", engName)
        .first();
      return city;
    } catch (error) {
      throw new Error(`Ошибка при получении города: ${error.message}`);
    }
  }
  async getCityName(id) {
    try {
      const city = await db("districts")
        .select("engname")
        .where("id", id)
        .first();

      return city.engname;
    } catch (error) {
      throw new Error(`Ошибка при получении города: ${error.message}`);
    }
  }
  async getTariff(id) {
    try {
      const tariff = await db("tariffs").select("*").where("id", id).first();
      console.log(tariff);
      return tariff;
    } catch (error) {
      throw new Error(`Ошибка при получении тарифа: ${error.message}`);
    }
  }
  async getTariffsByDistrictAndProvider(districtId, providerId) {
    try {
      const tariffs = await db("tariffs")
        .select("*")
        .where("district_id", districtId)
        .where("provider_id", providerId);
      return tariffs;
    } catch (error) {
      throw new Error(`Ошибка при получении тарифа: ${error.message}`);
    }
  }
}

export default AggregatorModel;
