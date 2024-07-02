import 

class AggregatorServiceV2 {
  constructor(aggregatorModelV2) {
    this.aggregatorModelV2 = aggregatorModelV2;
  }

  async getProvidersOnAddress(address) {

    const providers = await this.aggregatorModelV2.getProvidersOnAddress();

    return 
  }
}
