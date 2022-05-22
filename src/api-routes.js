import { poiApi } from "./api/poi-api.js";
import { userApi } from "./api/user-api.js";

export const apiRoutes = [
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "DELETE", path: "/api/users/{id}", config: userApi.deleteOne },

  { method: "GET", path: "/api/pois", config: poiApi.find },
  { method: "GET", path: "/api/pois/{id}", config: poiApi.findOne },
  { method: "POST", path: "/api/pois", config: poiApi.create },
  { method: "PUT", path: "/api/pois/{id}", config: poiApi.updateOne },
  { method: "DELETE", path: "/api/pois", config: poiApi.deleteAll },
  { method: "DELETE", path: "/api/pois/{id}", config: poiApi.deleteOne },
];
