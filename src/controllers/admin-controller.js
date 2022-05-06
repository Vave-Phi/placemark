import { db } from "../models/db.js";

export const adminController = {
  showAdmin: {
    handler: async function (request, h) {
      const users = await db.userStore.getAllUsers();
      return h.view("admin-view", { title: "Placemark - Admin Dashboard", users });
    },
  },
  delete: {
    handler: async function (request, h) {
      const { id } = request.params;
      await db.userStore.deleteUserById(id);
      return h.redirect("/admin");
    },
  },
};
