require("../load-env.ts");

const isDevelopment =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "dev";

const decodeB64 = value => {
  let decoded = "";
  try {
    decoded = Buffer.from(value, "base64").toString("ascii");
  } catch {
    // do nothing really
  }
  return decoded;
};

const environment = {
  ...process.env,
  isDevelopment,
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "production",
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_DIALECT: process.env.DATABASE_DIALECT
};

module.exports = environment;
