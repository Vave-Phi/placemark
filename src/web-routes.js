import { authController } from "./controllers/auth-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: authController.showLogin },
  { method: "GET", path: "/login", config: authController.showLogin },
  { method: "GET", path: "/signup", config: authController.showSignup },
  { method: "GET", path: "/logout", config: authController.logout },
  { method: "POST", path: "/register", config: authController.signup },
  { method: "POST", path: "/authenticate", config: authController.login },

  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },
];
