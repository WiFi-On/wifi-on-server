// models/aggregatorModel.js
import connectDB from "../config/db.js";
const db = connectDB();

class AggregatorModel {
  constructor() {
    this.tariffsTable = "tariffs";
    this.streetsTable = "streets";
    this.districtsTable = "districts";
    this.providersTable = "providers";
    this.providersOnStreetTable = "providersonstreet";
  }

  async getProvidersOnAddress(hashAddress) {
    try {
      const providers = await db(this.providersOnStreetTable)
        .select("provider_id")
        .where("street_id", hashAddress);
      return providers;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getIpAndCity(district_fias_id) {
    try {
      const infoDistrict = await db(this.districtsTable)
        .select("engname")
        .where("fias_id", district_fias_id);
      return infoDistrict;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getDistrictInfoByEngName(engName) {
    try {
      const infoDistrict = await db(this.districtsTable)
        .select("name", "namewhere")
        .where("engname", engName);
      return infoDistrict;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getTariffsByDistrictFiasId(districtFiasId) {
    try {
      const tariffs = await db(this.tariffsTable)
        .select("*")
        .where("district_id", districtFiasId);

      return tariffs;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getDistrictFiasIdByEngName(engName) {
    try {
      const fiasIdDistrict = await db(this.districtsTable)
        .select("id")
        .where("engname", engName);
      return fiasIdDistrict;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProvidersByDistrictFiasId(districtFiasId) {
    try {
      const providers = await db(this.tariffsTable)
        .distinct("provider_id")
        .where("district_id", districtFiasId);
      return providers;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getTariffsOnAddress(hashAddress) {
    console.log(hashAddress);
    try {
      const tariffs = await knex("tariffs as t")
        .select("t.*")
        .join("streets as s", "t.district_id", "s.district_id")
        .join("providersonstreet as ps", function () {
          this.on("ps.street_id", "=", "s.id").andOn(
            "ps.provider_id",
            "=",
            "t.provider_id"
          );
        })
        .join("technologiesonstreet as ts", "ts.street_id", "s.id")
        .where("s.id", hashAddress)
        .andWhere(function () {
          this.whereRaw(
            "(ts.technologies->>'xdsl')::boolean or t.technologies->>'xdsl' = 'true'"
          )
            .orWhereRaw(
              "(ts.technologies->>'fftx')::boolean or t.technologies->>'fftx' = 'true'"
            )
            .orWhereRaw(
              "(ts.technologies->>'pon')::boolean or t.technologies->>'pon' = 'true'"
            )
            .orWhereRaw(
              "(ts.technologies->>'pstn')::boolean or t.technologies->>'pstn' = 'true'"
            )
            .orWhereRaw(
              "(ts.technologies->>'wba')::boolean or t.technologies->>'wba' = 'true'"
            )
            .orWhereRaw(
              "(ts.technologies->>'docsis')::boolean or t.technologies->>'docsis' = 'true'"
            )
            .orWhereRaw(
              "(ts.technologies->>'unknown')::boolean or t.technologies->>'unknown' = 'true'"
            );
        });
      console.log(tariffs);
      return tariffs;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getTariff(tariffId) {
    try {
      const tariff = await db(this.tariffsTable)
        .select("*")
        .where("id", tariffId);
      return tariff;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // Старые методы
  // async getTariffsByDistrictId(districtId) {
  //   try {
  //     const tariffs = await db(this.tariffsTable)
  //       .select(`*`)
  //       .where(`district_id`, districtId);

  //     return tariffs;
  //   } catch (error) {
  //     throw new Error(
  //       `Ошибка при получении тарифов по населенному пункту: ${error.message}`
  //     );
  //   }
  // }
  // async getProvidersByDistrictId(districtId) {
  //   try {
  //     const providers = await db(this.tariffsTable)
  //       .distinct("provider_id")
  //       .where("district_id", districtId);

  //     return providers;
  //   } catch (error) {
  //     throw new Error(
  //       `Ошибка при получении провайдеров по населенному пункту: ${error.message}`
  //     );
  //   }
  // }
  // async getTariffsByHouse(houseId) {
  //   try {
  //     const tariffs = await db("streets as h")
  //       .join("providersonstreet as pos", "h.id", "pos.street_id")
  //       .join("tariffs as t", function () {
  //         this.on("h.districtid", "=", "t.district_id").andOn(
  //           "pos.provider_id",
  //           "=",
  //           "t.provider_id"
  //         );
  //       })
  //       .select("t.*")
  //       .where("h.id", houseId);

  //     return tariffs;
  //   } catch (error) {
  //     throw new Error(`Ошибка при получении тарифов по дому: ${error.message}`);
  //   }
  // }
  // async getProvidersByHouse(houseId) {
  //   const nameAndImageProviders = {
  //     1: { id: 1, name: "МТС", img: "mts.svg" },
  //     2: { id: 2, name: "Русская компания", img: "ruscom.svg" },
  //     3: { id: 3, name: "Билайн", img: "beeline.svg" },
  //     4: { id: 4, name: "Мегафон", img: "megafon.svg" },
  //     5: { id: 5, name: "Алматель", img: "almatel.svg" },
  //     6: { id: 6, name: "АБВ", img: "abv.svg" },
  //     7: { id: 7, name: "Ростелеком", img: "rtk.svg" },
  //     8: { id: 8, name: "Дом.ру", img: "domru.svg" },
  //     9: { id: 9, name: "Сибирский медведь", img: "sibMedved.svg" },
  //   };
  //   const result = [];

  //   try {
  //     // Запрос для получения уникальных provider_id
  //     const providers = await db("streets as h")
  //       .join("providersonstreet as pos", "h.id", "pos.street_id")
  //       .join("tariffs as t", function () {
  //         this.on("h.districtid", "=", "t.district_id").andOn(
  //           "pos.provider_id",
  //           "=",
  //           "t.provider_id"
  //         );
  //       })
  //       .distinct("t.provider_id")
  //       .where("h.id", houseId);

  //     // Преобразуем providers в массив provider_id
  //     const providerIds = providers.map((row) => row.provider_id);

  //     // Для каждого provider_id добавляем соответствующий объект из nameAndImageProviders в результат
  //     providerIds.forEach((providerId) => {
  //       if (nameAndImageProviders[providerId]) {
  //         result.push(nameAndImageProviders[providerId]);
  //       }
  //     });

  //     return result;
  //   } catch (error) {
  //     throw new Error(
  //       `Ошибка при получении уникальных provider_id: ${error.message}`
  //     );
  //   }
  // }
  // async getDistrictName(id) {
  //   try {
  //     const city = await db("districts")
  //       .select("*")
  //       .where("engname", id)
  //       .first();
  //     return city;
  //   } catch (error) {
  //     throw new Error(`Ошибка при получении города: ${error.message}`);
  //   }
  // }
  // async getProvidersByEngName(engName) {
  //   try {
  //     const providers = await db("tariffs")
  //       .select("provider_id")
  //       .distinct()
  //       .join("districts", "tariffs.district_id", "districts.id")
  //       .where("districts.engname", engName);

  //     return providers;
  //   } catch (error) {
  //     throw new Error(`Ошибка при получении города: ${error.message}`);
  //   }
  // }
  // async getTariffsByEngName(engName) {
  //   try {
  //     const tariffs = await db("tariffs")
  //       .select("tariffs.*")
  //       .join("districts", "tariffs.district_id", "districts.id")
  //       .where("districts.engname", engName);
  //     return tariffs;
  //   } catch (error) {
  //     throw new Error(`Ошибка при получении города: ${error.message}`);
  //   }
  // }
  // async getInfoDistrictByEngName(engName) {
  //   try {
  //     const city = await db("districts")
  //       .select("*")
  //       .where("engname", engName)
  //       .first();
  //     return city;
  //   } catch (error) {
  //     throw new Error(`Ошибка при получении города: ${error.message}`);
  //   }
  // }
  // async getCityName(id) {
  //   try {
  //     const city = await db("districts")
  //       .select("engname")
  //       .where("id", id)
  //       .first();

  //     return city.engname;
  //   } catch (error) {
  //     throw new Error(`Ошибка при получении города: ${error.message}`);
  //   }
  // }
  // async getTariff(id) {
  //   try {
  //     const tariff = await db("tariffs").select("*").where("id", id).first();
  //     console.log(tariff);
  //     return tariff;
  //   } catch (error) {
  //     throw new Error(`Ошибка при получении тарифа: ${error.message}`);
  //   }
  // }
  // async getTariffsByDistrictAndProvider(districtId, providerId) {
  //   try {
  //     const tariffs = await db("tariffs")
  //       .select("*")
  //       .where("district_id", districtId)
  //       .where("provider_id", providerId);
  //     return tariffs;
  //   } catch (error) {
  //     throw new Error(`Ошибка при получении тарифа: ${error.message}`);
  //   }
  // }
}

export default AggregatorModel;
