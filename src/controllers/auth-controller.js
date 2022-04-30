export const authController = {
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Welcome to Placemark" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Placemark" });
    },
  },
};
