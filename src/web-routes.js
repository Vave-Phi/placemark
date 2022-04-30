import { authController } from "./controllers/auth-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: authController.showLogin },
  { method: "GET", path: "/login", config: authController.showLogin },
  { method: "GET", path: "/signup", config: authController.showSignup },

  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },
];
