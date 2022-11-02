const { Shopify } = require("../services/shopify");
const cookie = require("cookie-signature");
const crypto = require("crypto");
const axios = require("axios");
const {
  Session,
} = require("@shopify/shopify-api/dist/auth/session/session.js");

const {
  CONSTANTS: { OAuth },
} = require("../data/constants");

exports.handler = async (event, context, callback) => {
  const { headers, queryStringParameters } = event;
  const { Cookie } = headers;
  const { code, hmac, host, shop, state, timestamp } = queryStringParameters;

  const cookieString = Cookie.replace(OAuth.STATE_COOKIE_NAME, "").replace(
    "=",
    ""
  );

  const { API_SECRET_KEY, API_KEY } = Shopify.Context;

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
  console.log({ queryStringWithoutHmac, hmacIsCorrect });
  if (!hmacIsCorrect) return; // handle error

  const shopNameIsValid = /^[a-zA-Z0-9][a-zA-Z0-9\-]*.myshopify.com/.test(shop);

  console.log({ shopNameIsValid });
  if (!shopNameIsValid) return; // handle error

  const response = await axios
    .post(
      `https://${shop}/admin/oauth/access_token?client_id=${API_KEY}&client_secret=${API_SECRET_KEY}&code=${code}`
    )
    .then(async (res) => {
      const { data } = res;
      console.log({ data });
      return data;
    });

  const newSession = new Session("offline_" + shop, shop, state, false);
  newSession.accessToken = response.access_token;
  newSession.scope = response.scope;
  console.log(newSession);
  const session = Shopify.Context.SESSION_STORAGE.storeSession(newSession);

  const request = {};
  request.headers = event.headers;
  request.url = event?.requestContext?.resourcePath + `?host=${host}`;
  // console.log({ request });
  // https://oaysus-dev.myshopify.com/admin/apps/3e4e24721e43d1025464f022874885f3/

  const redirectUrl = Shopify.Context.IS_EMBEDDED_APP
    ? Shopify.Utils.getEmbeddedAppUrl(request)
    : `/?shop=${session?.shop}&host=${encodeURIComponent(host)}`;

  console.log({ redirectUrl });
};
