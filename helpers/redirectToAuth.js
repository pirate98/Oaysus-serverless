const { Shopify } = require("@shopify/shopify-api");
const cookie = require("cookie-signature");

const {
  CONSTANTS: { OAuth },
} = require("../data/constants");

module.exports.redirectToAuth = async (event, context) => {
  // console.log({ event });

  const { queryStringParameters } = event;

  if (!queryStringParameters.shop) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "No shop provided" }),
    };
  }

  console.log("embedded:", queryStringParameters.embedded);
  if (queryStringParameters.embedded === "1") {
    // return clientSideRedirect(req, res);
  }

  return await serverSideRedirect(event, context);
};

// function clientSideRedirect(req, res) {
//   const shop = Shopify.Utils.sanitizeShop(req.query.shop);
//   const redirectUriParams = new URLSearchParams({
//     shop,
//     host: req.query.host,
//   }).toString();
//   const queryParams = new URLSearchParams({
//     ...req.query,
//     shop,
//     redirectUri: `https://${Shopify.Context.HOST_NAME}/api/auth?${redirectUriParams}`,
//   }).toString();

//   return res.redirect(`/exitiframe?${queryParams}`);
// }

async function serverSideRedirect(event, context) {
  console.log("serverSideRedirect");
  // console.log(Shopify.Context);
  const { API_SECRET_KEY } = Shopify.Context;
  const [url, state] = getRedirectUrl(event);

  const expires = "expires=" + new Date(Date.now() + 60000);
  const sameSite = "SameSite=Lax";
  const signedState = cookie.sign(state, API_SECRET_KEY);
  const stateString = OAuth.STATE_COOKIE_NAME + "=" + signedState;
  const cookieString =
    stateString + "; " + expires + "; " + sameSite + "; " + "Secure";
  // console.log({ event });
  // console.log({ context });
  console.log({ cookieString });

  return {
    statusCode: 302,
    headers: { Location: url, "Set-Cookie": cookieString },
    // body: JSON.stringify({ message: "No shop provided" }),
  };
}

function getRedirectUrl(event, isOnline) {
  const { queryStringParameters } = event;
  // console.log(Shopify.Context);
  const { API_KEY } = Shopify.Context;

  const shop = queryStringParameters?.shop.split(".")[0];
  const scopes = process.env.SCOPES;
  // const redirectPath = "/dev/auth/callback";
  const redirect_uri = getAuthorizationCallbackUri();

  const nonce = Math.floor(Math.random() * 1000000);
  const state = isOnline ? "online_".concat(nonce) : "offline_".concat(nonce);

  const grant_options = isOnline ? "per-user" : "";

  const url = `https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${API_KEY}&scope=${scopes}&redirect_uri=${redirect_uri}&state=${state}&grant_options[]=${grant_options}`;
  console.log({ shop, url, state });
  return [url, state];
}

function getAuthorizationCallbackUri() {
  const redirectPath = OAuth.REDIRECT_PATH;

  const { HOST_SCHEME, HOST_NAME } = Shopify.Context;

  let redirect_uri;

  if (process.env.NODE_ENV === "production") {
    redirect_uri = ""
      .concat(HOST_SCHEME, "://")
      .concat(HOST_NAME)
      .concat(redirectPath);
  } else {
    redirect_uri = `${process.env.AWS_REDIRECT_URL}?redirectPath=${redirectPath}`;
  }

  return redirect_uri;
}
