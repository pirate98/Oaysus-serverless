const ngrok = require("ngrok");

const { makeShopifyUrl } = require("../helpers");

async function main() {
  const url = await ngrok.connect(3010);
  const api = ngrok.getApi();
  const tunnels = await api.listTunnels();
  const apiUrl = ngrok.getUrl();

  console.log(tunnels);
  console.log({ url, apiUrl });
  console.log("Shopify Url");
  console.log(makeShopifyUrl(url));
}

main();
