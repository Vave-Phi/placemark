import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, PoiArray, PoiSpecDomain, PoiSpecUpdate } from "../db/joi-schemas.js";
import { validationError } from "../logger.js";

export const poiApi = {
  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        return await db.poiStore.getAllPois();
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
    auth: false,
    handler: async function (request, h) {
      try {
        const poi = await db.poiStore.getPoiById(request.params.id);
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
    auth: false,
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
    auth: false,
    handler: async function (request, h) {
      try {
        const poi = await db.poiStore.updatePoiById(request.params.id, request.payload);
        if (poi) {
          return h.response(poi).code(201);
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
    auth: false,
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
    auth: false,
    handler: async function (request, h) {
      try {
        await db.poiStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all pois",
  },
};
