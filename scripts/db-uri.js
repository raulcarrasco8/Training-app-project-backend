// Elige la base de datos de los scripts:
// - por defecto, MONGODB_URI (la de desarrollo en tu .env)
// - con --prod, PROD_MONGODB_URI (la de producción)
require("dotenv").config({ quiet: true });

const getMongoUri = () => {
  const isProd = process.argv.includes("--prod");
  const uri = isProd ? process.env.PROD_MONGODB_URI : process.env.MONGODB_URI;

  if (!uri) {
    const name = isProd ? "PROD_MONGODB_URI" : "MONGODB_URI";
    console.error(`Missing ${name} in .env`);
    process.exit(1);
  }

  return uri;
};

module.exports = { getMongoUri };
