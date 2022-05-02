import { v4 } from "uuid";
// eslint-disable-next-line import/no-unresolved
import { JSONFile, Low } from "lowdb";

const db = new Low(new JSONFile("./src/models/json/pois.json"));
db.data = { pois: [] };

export const poiJsonStore = {
  async getAllPois() {
    await db.read();
    return db.data.pois;
  },

  async addPoi(poi) {
    await db.read();
    poi._id = v4();
    db.data.pois.push(poi);
    await db.write();
    return poi;
  },

  async updatePoiById(id, changes) {
    await db.read();
    const index = db.data.pois.findIndex((p) => p._id === id);
    db.data.pois[index] = { ...changes, ...db.data.pois[index] };
    await db.write();
  },

  async getPoiById(id) {
    await db.read();
    const list = db.data.pois.find((poi) => poi._id === id);
    return list ?? null;
  },

  async deletePoiById(id) {
    console.log(id);
    await db.read();
    const index = db.data.pois.findIndex((poi) => poi._id === id);
    console.log(index);
    if (index > -1) db.data.pois.splice(index, 1);
    await db.write();
  },

  async deleteAll() {
    db.data.pois = [];
    await db.write();
  },
};
