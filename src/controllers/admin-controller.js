import { db } from "../models/db.js";

export const adminController = {
  showAdmin: {
    handler: async function (request, h) {
      const user = request.auth.credentials;
      if (!user.isAdmin) {
        return h.redirect("/pois");
      }

      const users = await db.userStore.getAllUsers();
      return h.view("admin-view", { title: "Placemark - Admin Dashboard", users });
    },
  },
  delete: {
    handler: async function (request, h) {
      const user = request.auth.credentials;
      if (!user.isAdmin) {
        return h.redirect("/pois");
      }

      const { id } = request.params;
      await db.userStore.deleteUserById(id);
      return h.redirect("/admin");
    },
  },
};
