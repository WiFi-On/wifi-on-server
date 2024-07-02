import connectDBv2 from "../config/dbV2";

const db = connectDBv2();

class AggregatorModelV2 {
  constructor() {
    this.tariffsTable = "tariffs";
    this.providersTable = "providers";
    this.streetsTable = "streets";
    this.providersOnStreetTable = "providersonstreet";
  }

  async getProvidersOnAddress(hash_address_id) {
    try {
      const providers = await db(this.providersOnStreetTable)
        .select(`prvoder_id`)
        .where(`district_id`, hash_address_id);

      return providers;
    } catch (error) {
      throw new Error(
        `Ошибка при получении провайдеров по адресу: ${error.message}`
      );
    }
  }
}
