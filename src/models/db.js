import { userMemStore } from "./mem/user-mem-store.js";
import { poiMemStore } from "./mem/poi-mem-store.js";
import { poiJsonStore } from "./json/poi-json-store.js";
import { userJsonStore } from "./json/user-json-store.js";
import { connectMongo } from "./mongo/connect.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { poiMongoStore } from "./mongo/poi-mongo-store.js";

export const db = {
  userStore: null,
  poiStore: null,

  initMem() {
    this.userStore = userMemStore;
    this.poiStore = poiMemStore;
  },

  initJSON() {
    this.userStore = userJsonStore;
    this.poiStore = poiJsonStore;
  },

  async initMongo() {
    this.userStore = userMongoStore;
    this.poiStore = poiMongoStore;
    await connectMongo();
  },
};
