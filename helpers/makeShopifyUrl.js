module.exports.makeShopifyUrl = (str) => {
  const shop = "oaysus-dev.myshopify.com";
  const host = process.env.SHOPIFY_HOST;
  const isProduction = process.env.NODE_ENV === "production";

  return `${str}${isProduction ? "" : "/dev"}?shop=${shop}&host=${host}`;
};
