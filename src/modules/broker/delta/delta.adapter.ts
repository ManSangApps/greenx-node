import { DeltaClient } from "./delta.client";

export class DeltaAdapter {
  constructor(
    private apiKey: string,
    private apiSecret: string,
  ) {}

  async verifyConnection() {
    const client = new DeltaClient(this.apiKey, this.apiSecret);
    await client.getAccountInfo(); // throws if invalid
    return true;
  }

  async getAccountInfo() {
    const client = new DeltaClient(this.apiKey, this.apiSecret);
    return client.getAccountInfo();
  }
}
