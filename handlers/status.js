const { Shopify } = require("@shopify/shopify-api");
const axios = require("axios");

const { makeShopifyUrl, getApiGateway, redirectToAuth } = require("../helpers");
const { AppInstallations } = require("../services/shopify");

exports.handler = async (event, context, callback) => {
  const isProd = process.env.NODE_ENV === "production";

  // console.log({ context });
  console.log({ env: process.env.DATABASE_URL });
  const { queryStringParameters, requestContext } = event;
  console.log({ queryStringParameters });
  // console.log({ event, context, callback });

  if (typeof queryStringParameters?.shop !== "string") {
    const ngrokUrl = getApiGateway();
    const ngrokShopUrl = makeShopifyUrl(ngrokUrl);
    console.log(ngrokUrl);

    /**
     * App is running first time. Register ngrok url to url redirector.
     * Redirect to ngrok shop url
     */

    axios.get(process.env.AWS_REDIRECT_URL + `?redirectUrl=${ngrokUrl}`);

    return {
      statusCode: 302,
      headers: { Location: ngrokShopUrl },
    };
  }

  const shop = Shopify.Utils.sanitizeShop(queryStringParameters.shop);
  const appInstalled = await AppInstallations.includes(shop);
  console.log({ appInstalled });
  // console.log({ event })

  if (!appInstalled && !requestContext?.resourcePath?.match(/^\/exitiframe/i)) {
    console.log("iframe checking");
    return redirectToAuth(event, context);
  }
  console.log("redirecting to:", process.env.FRONTEND_URL);
  return {
    statusCode: 302,
    headers: { Location: process.env.FRONTEND_URL },
  };
};
