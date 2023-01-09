import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xD442A9EbCa011820c9a70502B9ef2a3C2B7B4b0B"
);

export default instance;
