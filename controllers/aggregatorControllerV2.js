class AggregatorControllerV2 {
  constructor(aggregatorServiceV2) {
    this.aggregatorServiceV2 = aggregatorServiceV2;
  }

  async getProvidersOnStreet(req, res) {
    try {
      const providers = await this.aggregatorServiceV2.getProvidersOnAddress(
        req.params.address
      );
      res.status(200).json(providers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default AggregatorControllerV2;
