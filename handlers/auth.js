const { Shopify } = require("../services/shopify");
const cookie = require("cookie-signature");
const crypto = require("crypto");

const {
  CONSTANTS: { OAuth },
} = require("../data/constants");

exports.handler = async (event, context, callback) => {
  console.log({ event, context });
  const { headers, queryStringParameters } = event;
  const { Cookie } = headers;
  const { code, hmac, host, shop, state, timestamp } = queryStringParameters;

  const cookieString = Cookie.replace(OAuth.STATE_COOKIE_NAME, "").replace(
    "=",
    ""
  );

  const { API_SECRET_KEY } = Shopify.Context;

  const cookieIsSigned = cookie.unsign(cookieString, API_SECRET_KEY) === state;
  console.log({ cookieIsSigned, API_SECRET_KEY });
  if (!cookieIsSigned) return; // handle error

  const queryStringWithoutHmac = Object.keys(queryStringParameters)
    .reduce((prev, cur) => {
      if (cur === "hmac") return prev;
      return prev + "&" + cur + "=" + queryStringParameters[cur];
    }, "")
    .slice(1);

  const hmacIsCorrect =
    crypto
      .createHmac("sha256", API_SECRET_KEY)
      .update(queryStringWithoutHmac)
      .digest("hex") === hmac;
  console.log({ hmacIsCorrect });
  if (!hmacIsCorrect) return; // handle error

  const shopNameIsValid = /^[a-zA-Z0-9][a-zA-Z0-9\-]*.myshopify.com/.test(shop);

  console.log({ shopNameIsValid });
  if (!shopNameIsValid) return; // handle error
};
