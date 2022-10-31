const { Shopify, LATEST_API_VERSION } = require("@shopify/shopify-api");
const {
  storeCallback,
  loadCallback,
  deleteCallback,
  deleteSessionsCallback,
  findSessionsByShopCallback,
} = require("./prisma");

const { getApiGateway } = require("../helpers");

const host = getApiGateway();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: host.replace(/https?:\/\//, ""),
  HOST_SCHEME: host.split("://")[0],
  API_VERSION: LATEST_API_VERSION,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  // See note below regarding using CustomSessionStorage with this template.
  // SESSION_STORAGE: new Shopify.Session.SQLiteSessionStorage(DB_PATH),
  SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
    storeCallback,
    loadCallback,
    deleteCallback,
    deleteSessionsCallback,
    findSessionsByShopCallback
  ),
  ...(process.env.SHOP_CUSTOM_DOMAIN && {
    CUSTOM_SHOP_DOMAINS: [process.env.SHOP_CUSTOM_DOMAIN],
  }),
});

module.exports.AppInstallations = {
  includes: async function (shopDomain) {
    console.log({ CONTEXT: Shopify.Context });
    const shopSessions =
      await Shopify.Context.SESSION_STORAGE.findSessionsByShop(shopDomain);

    if (shopSessions.length > 0) {
      for (const session of shopSessions) {
        if (session.accessToken) return true;
      }
    }

    return false;
  },

  delete: async function (shopDomain) {
    const shopSessions =
      await Shopify.Context.SESSION_STORAGE.findSessionsByShop(shopDomain);
    if (shopSessions.length > 0) {
      await Shopify.Context.SESSION_STORAGE.deleteSessions(
        shopSessions.map((session) => session.id)
      );
    }
  },
};

module.exports.Shopify = Shopify;
