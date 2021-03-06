import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, UserArray, UserSpec, UserSpecDomain } from "../db/joi-schemas.js";
import { validationError } from "../logger.js";
import { createToken, getUserFromRequest } from "./jwt-utils.js";

export const userApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
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
    auth: {
      strategy: "jwt",
    },
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
    response: { schema: UserSpecDomain, failAction: validationError },
  },

  create: {
    auth: false,
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
    validate: { payload: UserSpec, failAction: validationError },
    response: { schema: UserSpecDomain, failAction: validationError },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const user = getUserFromRequest(request);
        if (!user || !user.isAdmin) {
          return Boom.unauthorized("User does not exist or is not an admin");
        }
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
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const user = getUserFromRequest(request);
        if (!user || !user.isAdmin) {
          return Boom.unauthorized("User does not exist or is not an admin");
        }
        await db.userStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all users",
  },
  isAdmin: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const user = getUserFromRequest(request);
        return user?.isAdmin;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserByEmail(request.payload.email);
        if (!user) {
          return Boom.unauthorized("User not found");
        }
        if (user.password !== request.payload.password) {
          return Boom.unauthorized("Invalid password");
        }
        const token = createToken(user);
        return h.response({ success: true, token: token }).code(201);
      } catch (err) {
        console.log(err);
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
};
