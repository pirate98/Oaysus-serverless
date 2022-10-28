const { parse } = require("envfile");
const fs = require("fs");
const path = require("path");

const pathToEnvFile = path.join(__dirname, "..", ".env");

module.exports.getApiGateway = () => {
  const data = fs.readFileSync(pathToEnvFile, "utf8");
  return parse(data)?.API_GATEWAY;
};
