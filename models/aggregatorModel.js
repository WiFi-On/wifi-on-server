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
        .where("id", district_fias_id);
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
    try {
      const tariffs = await db("tariffs as t")
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

  async getAllCitiesEndName() {
    try {
      const cities = await db(this.districtsTable).select("engname");
      return cities;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getEngNameDistrictByFiasId(fiasIdDistrict) {
    try {
      const engName = await db(this.districtsTable)
        .select("*")
        .where("id", fiasIdDistrict);
      return engName;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default AggregatorModel;
