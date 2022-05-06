import { db } from "../models/db.js";
import { PoiSpec, PoiSpecUpdate } from "../db/joi-schemas.js";
import { POI_CATEGORIES } from "../constants.js";

async function getHomeViewData(request) {
  const { name } = request.query;
  const user = request.auth.credentials;
  const pois = await db.poiStore.getAllPois(name);
  return {
    title: "Placemark - POIs",
    pois,
    user,
    query: name,
  };
}

async function getPoiViewData(request) {
  const { id } = request.params;
  const user = request.auth.credentials;
  const poi = await db.poiStore.getPoiById(id);
  return {
    title: "Placemark - POI Details",
    poi,
    user,
  };
}

export const poiController = {
  showHome: {
    handler: async function (request, h) {
      const viewData = await getHomeViewData(request);
      return h.view("home-view", viewData);
    },
  },
  showDetails: {
    handler: async function (request, h) {
      const viewData = await getPoiViewData(request);
      return h.view("poi-view", viewData);
    },
  },
  showEdit: {
    handler: async function (request, h) {
      const viewData = await getPoiViewData(request);
      return h.view("poi-edit-view", { ...viewData, options: POI_CATEGORIES });
    },
  },
  create: {
    validate: {
      payload: PoiSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const viewData = await getHomeViewData(request);
        return h
          .view("home-view", { ...viewData, errors: error.details })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      await db.poiStore.addPoi(request.payload);
      return h.redirect("/pois");
    },
  },
  update: {
    validate: {
      payload: PoiSpecUpdate,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const viewData = await getPoiViewData(request);
        return h
          .view("poi-view", { ...viewData, errors: error.details })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const { id } = request.params;
      await db.poiStore.updatePoiById(id, request.payload);
      return h.redirect(`/pois/${id}`);
    },
  },
  delete: {
    handler: async function (request, h) {
      const { id } = request.params;
      await db.poiStore.deletePoiById(id);
      return h.redirect("/pois");
    },
  },
};
