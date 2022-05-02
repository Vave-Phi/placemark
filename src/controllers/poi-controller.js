import { db } from "../models/db.js";
import { PoiSpec, PoiSpecUpdate } from "../db/joi-schemas.js";

async function getViewData(request) {
  const user = request.auth.credentials;
  const pois = await db.poiStore.getAllPois();
  return {
    title: "Placemark - POIs",
    pois,
    user,
  };
}

export const poiController = {
  showHome: {
    auth: false,
    handler: async function (request, h) {
      const viewData = await getViewData(request);
      return h.view("home-view", viewData);
    },
  },
  create: {
    validate: {
      payload: PoiSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const viewData = await getViewData(request);
        return h
          .view("home-view", { ...viewData, errors: error.details })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      await db.poiStore.addPoi(request.payload);
      return h.redirect("/home");
    },
  },
  update: {
    validate: {
      payload: PoiSpecUpdate,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const viewData = await getViewData(request);
        return h
          .view("home-view", { ...viewData, errors: error.details })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const { id } = request.params;
      await db.poiStore.updatePoiById(id, request.payload);
      return h.redirect("/home");
    },
  },
  delete: {
    handler: async function (request, h) {
      const { id } = request.params;
      await db.poiStore.deletePoiById(id);
      return h.redirect("/home");
    },
  },
};
