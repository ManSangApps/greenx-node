import axios from "axios";
import crypto from "crypto";

// const BASE_URL = "https://api.india.delta.exchange";
const BASE_URL = "https://cdn-ind.testnet.deltaex.org";

export class DeltaClient {
  constructor(
    private apiKey: string,
    private apiSecret: string,
  ) {}

  private sign(method: string, requestPath: string, body: string = "") {
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const payload = method + timestamp + requestPath + body;

    const signature = crypto
      .createHmac("sha256", this.apiSecret)
      .update(payload)
      .digest("hex");

    return {
      "api-key": this.apiKey,
      "timestamp": timestamp,
      "signature": signature,
      "Content-Type": "application/json",
    };
  }

  async getAccountInfo() {
    const path = "/v2/profile";

    const headers = this.sign("GET", path);

    const res = await axios.get(`${BASE_URL}${path}`, {
      headers,
    });

    return res.data?.result;
  }
}
