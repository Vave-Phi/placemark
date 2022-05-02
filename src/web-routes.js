import { authController } from "./controllers/auth-controller.js";
import { poiController } from "./controllers/poi-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: authController.showLogin },
  { method: "GET", path: "/login", config: authController.showLogin },
  { method: "GET", path: "/signup", config: authController.showSignup },
  { method: "GET", path: "/logout", config: authController.logout },
  { method: "POST", path: "/register", config: authController.signup },
  { method: "POST", path: "/authenticate", config: authController.login },

  { method: "GET", path: "/pois", config: poiController.showHome },
  { method: "GET", path: "/pois/{id}", config: poiController.showDetails },
  { method: "GET", path: "/pois/{id}/edit", config: poiController.showEdit },
  { method: "POST", path: "/pois/create", config: poiController.create },
  { method: "POST", path: "/pois/update/{id}", config: poiController.update },
  { method: "GET", path: "/pois/delete/{id}", config: poiController.delete },

  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },
];
