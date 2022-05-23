import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Inert from "@hapi/inert";
import jwt from "hapi-auth-jwt2";
import Handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";
import HapiSwagger from "hapi-swagger";
import Joi from "joi";
import { apiRoutes } from "./api-routes.js";
import { db } from "./models/db.js";
import hbsConfig from "./hbs-config.js";
import { webRoutes } from "./web-routes.js";
import { validate } from "./api/jwt-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  info: {
    title: "Placemark API",
    version: "0.1",
  },
};

async function init() {
  const server = Hapi.server({
    port: 3001,
    host: "localhost",
    routes: { cors: true },
  });
  await server.register(Vision);
  await server.register(Inert);
  // await server.register(Cookie);
  await server.register(jwt);
  await server.register({
    plugin: HapiSwagger,
    options: swaggerOptions,
  });
  server.validator(Joi);
  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });
  server.auth.strategy("jwt", "jwt", {
    key: process.env.cookie_password,
    validate,
    verifyOptions: { algorithms: ["HS256"] },
  });
  // db.initMem();
  // db.initJSON();
  await db.initMongo();
  hbsConfig();
  server.route(webRoutes);
  server.route(apiRoutes);
  await server.start();
  console.log("Server running on %s", server.info.uri);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
