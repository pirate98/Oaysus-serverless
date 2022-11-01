const axios = require("axios");

const { makeShopifyUrl, getApiGateway, redirectToAuth } = require("../helpers");
const { AppInstallations, Shopify } = require("../services/shopify");

exports.handler = async (event, context, callback) => {
  const isProd = process.env.NODE_ENV === "production";

  // console.log({ context });
  console.log({ env: process.env.DATABASE_URL });
  const { queryStringParameters, requestContext } = event;
  console.log({ queryStringParameters });
  // console.log({ event, context, callback });
  const { embedded, shop } = queryStringParameters || {};

  if (typeof shop !== "string") {
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

  const _shop = Shopify.Utils.sanitizeShop(shop);
  const appInstalled = await AppInstallations.includes(_shop);
  console.log({ appInstalled });
  // console.log({ event })

  if (!appInstalled && !requestContext?.resourcePath?.match(/^\/exitiframe/i)) {
    console.log("iframe checking");
    return redirectToAuth(event, context);
  }

  if (Shopify.Context.IS_EMBEDDED_APP && embedded !== "1") {
    const embeddedUrl = `https://${shop}/admin/apps/${Shopify.Context.API_KEY}`;
    console.log("redirecting to embedded app url:", embeddedUrl);
    // const embeddedUrl = Shopify.Utils.getEmbeddedAppUrl(req);
    // https://oaysus-dev.myshopify.com/admin/apps/3e4e24721e43d1025464f022874885f3/
    // return res.redirect(embeddedUrl + req.path);
    return {
      statusCode: 302,
      headers: { Location: embeddedUrl },
    };
  }
};
