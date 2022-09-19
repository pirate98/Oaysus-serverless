exports.handler = async (event, context, callback) => {
  console.log({ env: process.env.DATABASE_URL });
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ up: true }),
  };
};
