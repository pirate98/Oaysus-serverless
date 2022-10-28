const { PrismaClient } = require("@prisma/client");
const { Session } = require("@shopify/shopify-api/dist/auth/session/index.js");

const prisma = new PrismaClient();

module.exports.storeCallback = async (session) => {
  const { id, shop } = session;

  return prisma.storeSession
    .upsert({
      where: { id },
      create: { id, payload: session, shop },
      update: { payload: session },
    })
    .then((_) => true)
    .catch((error) => {
      console.log({ error });
      return false;
    });
};

module.exports.loadCallback = async (shop) => {
  console.log({ shop });
  return prisma.storeSession
    .findUnique({
      where: {
        id: shop,
      },
    })
    .then((data) => {
      if (!data) return;

      return getSessionFromPayload(data.payload);
    })
    .catch((error) => {
      console.log({ error });
      return;
    });
};

module.exports.deleteCallback = async (id) => {
  return prisma.storeSession
    .delete({
      where: {
        id,
      },
    })
    .then((data) => true)
    .catch((error) => false);
};

module.exports.deleteSessionsCallback = async (arr) => {
  return Promise.all(arr.map((id) => deleteCallback(id)))
    .then((_) => true)
    .catch((error) => false);
};

module.exports.findSessionsByShopCallback = async (shop) => {
  console.log("findSessionsByShop():", shop);

  const sessions = await prisma.storeSession.findMany({
    where: {
      shop,
    },
  });
  console.log({ sessions });
  return sessions.map((data) => getSessionFromPayload(data.payload));
};

function getSessionFromPayload(payload) {
  const { isActive, id, shop, state, isOnline, ...rest } = payload;

  const session = new Session(id, shop, state, isOnline);

  for (const each in rest) {
    session[each] = payload[each];
  }

  console.log({ session });

  return session;
}
