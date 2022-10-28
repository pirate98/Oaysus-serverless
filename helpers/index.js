const { getApiGateway } = require("./getApiGateway");
const { makeShopifyUrl } = require("./makeShopifyUrl");
const { redirectToAuth } = require("./redirect-to-auth");

module.exports = { getApiGateway, makeShopifyUrl, redirectToAuth };
