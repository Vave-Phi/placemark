import { userMemStore } from "./mem/user-mem-store.js";

export const db = {
  userStore: null,

  initMem() {
    this.userStore = userMemStore;
  },
};
