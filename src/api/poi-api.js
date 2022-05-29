import Boom from "@hapi/boom";
import Joi from "joi";
import { db } from "../models/db.js";
import { IdSpec, PoiArray, PoiSpecDomain, PoiSpecUpdate } from "../db/joi-schemas.js";
import { validationError } from "../logger.js";
import { imageStore } from "../models/image-store.js";
import { weatherService } from "../models/weather-service.js";

export const poiApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const pois = await db.poiStore.getAllPois(request.query);
        await weatherService.getWeatherForPois(pois);
        return pois;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all pois",
    notes: "Returns details of all pois",
    response: { schema: PoiArray, failAction: validationError },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const poi = await db.poiStore.getPoiById(request.params.id);
        poi.weather = await weatherService.getWeather(poi.lat, poi.lng);
        if (!poi) {
          return Boom.notFound("No Poi with this id");
        }
        return poi;
      } catch (err) {
        return Boom.serverUnavailable("No Poi with this id");
      }
    },
    tags: ["api"],
    description: "Get one poi",
    notes: "Returns details of one poi by its id",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: PoiSpecDomain, failAction: validationError },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const poi = await db.poiStore.addPoi(request.payload);
        if (poi) {
          return h.response(poi).code(201);
        }
        return Boom.badImplementation("error creating poi");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a poi",
    validate: { payload: PoiSpecUpdate, failAction: validationError },
    response: { schema: PoiSpecDomain, failAction: validationError },
  },

  updateOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const poi = await db.poiStore.updatePoiById(request.params.id, request.payload);
        if (poi) {
          return h.response(poi).code(200);
        }
        return Boom.badImplementation("error updating poi");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Update a poi",
    validate: { params: { id: IdSpec }, payload: PoiSpecUpdate, failAction: validationError },
    response: { schema: PoiSpecDomain, failAction: validationError },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.poiStore.deletePoiById(request.params.id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete a poi by id",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.poiStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  uploadImage: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const { id } = request.params;
        const file = request.payload.image;
        if (Object.keys(file).length === 0) {
          return Boom.badImplementation("error uploading poi image");
        }
        const poi = await db.poiStore.getPoiById(id);
        if (poi.img) {
          await imageStore.deleteImage(poi.img);
        }
        const url = await imageStore.uploadImage(request.payload.image);
        await db.poiStore.updatePoiById(id, { img: url });
        return url;
      } catch (err) {
        console.log(err);
        return Boom.serverUnavailable("Database Error");
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
    tags: ["api"],
    description: "Upload a poi image",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: Joi.string(), failAction: validationError },
  },

  deleteImage: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const { id } = request.params;
        const poi = await db.poiStore.getPoiById(id);
        if (poi.img) {
          await imageStore.deleteImage(poi.img);
          await db.poiStore.updatePoiById(id, { img: null });
          return h.response().code(204);
        }
        return Boom.badImplementation("error deleting poi image");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete a poi image",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },
};
