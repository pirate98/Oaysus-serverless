const { Shopify } = require("@shopify/shopify-api");
const { makeShopifyUrl, getApiGateway, redirectToAuth } = require("../helpers");
const { AppInstallations } = require("../services/shopify");

exports.handler = async (event, context, callback) => {
  // console.log({ context });
  console.log({ env: process.env.DATABASE_URL });
  const { queryStringParameters, requestContext } = event;
  console.log({ queryStringParameters });
  // console.log({ event, context, callback });

  if (typeof queryStringParameters?.shop !== "string") {
    const ngrok = makeShopifyUrl(getApiGateway());
    console.log(ngrok);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messsage: "No shop provided",
        ngrok,
      }),
    };
  }

  const shop = Shopify.Utils.sanitizeShop(queryStringParameters.shop);
  const appInstalled = await AppInstallations.includes(shop);
  console.log({ appInstalled });

  if (!appInstalled && !requestContext?.resourcePath?.match(/^\/exitiframe/i)) {
    return redirectToAuth(event, context);
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ up: true }),
  };

  if (typeof req.query.shop !== "string") {
    res.status(500);
    return res.send("No shop provided");
  }
  console.log(req.query);
  // const shop = Shopify.Utils.sanitizeShop(req.query.shop);
  // const appInstalled = await AppInstallations.includes(shop);
  console.log({ shop, appInstalled });
  if (!appInstalled && !req.originalUrl.match(/^\/exitiframe/i)) {
    return redirectToAuth(req, res, app);
  }

  if (Shopify.Context.IS_EMBEDDED_APP && req.query.embedded !== "1") {
    const embeddedUrl = Shopify.Utils.getEmbeddedAppUrl(req);
    console.log("app installed", embeddedUrl + req.path);
    return res.redirect(embeddedUrl + req.path);
  }

  const htmlFile = join(
    isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH,
    "index.html"
  );
  console.log("responding with html");
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(htmlFile));
};
