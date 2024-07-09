import crypto from "crypto";

class AggregatorServiceV2 {
  constructor(aggregatorModelV2) {
    this.aggregatorModelV2 = aggregatorModelV2;
  }
  async generateHash(address, algorithm = "md5") {
    let hash;
    try {
      hash = crypto.createHash(algorithm);
    } catch (error) {
      throw new Error(`Unsupported algorithm: ${algorithm}`);
    }

    hash.update(address);
    const hashHex = hash.digest("hex");

    return hashHex;
  }

  async getProvidersOnAddress(address) {
    const hash = await this.generateHash(address);
    const providers = await this.aggregatorModelV2.getProvidersOnAddress(hash);
    return providers;
  }
}

export default AggregatorServiceV2;
