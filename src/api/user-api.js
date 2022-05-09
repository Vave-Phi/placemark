import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, UserArray, UserSpec, UserSpecDomain } from "../db/joi-schemas.js";
import { validationError } from "../logger.js";

export const userApi = {
  find: {
    handler: async function (request, h) {
      try {
        return await db.userStore.getAllUsers();
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all users",
    notes: "Returns details of all users",
    response: { schema: UserArray, failAction: validationError },
  },

  findOne: {
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserById(request.params.id);
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.serverUnavailable("No User with this id");
      }
    },
    tags: ["api"],
    description: "Get one user",
    notes: "Returns details of one user",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: UserSpec, failAction: validationError },
  },

  create: {
    handler: async function (request, h) {
      try {
        const user = await db.userStore.addUser(request.payload);
        if (user) {
          return h.response(user).code(201);
        }
        return Boom.badImplementation("error creating user");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a user",
    validate: { payload: UserSpecDomain, failAction: validationError },
    response: { schema: UserSpec, failAction: validationError },
  },

  deleteOne: {
    handler: async function (request, h) {
      try {
        // TODO only allow if user is admin (jwt needed first)
        await db.userStore.deleteUserById(request.params.id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete a user by id",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  deleteAll: {
    handler: async function (request, h) {
      try {
        // TODO only allow if user is admin (jwt needed first)
        await db.userStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all users",
  },
};
