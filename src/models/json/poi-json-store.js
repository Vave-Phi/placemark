import { v4 } from "uuid";
// eslint-disable-next-line import/no-unresolved
import { JSONFile, Low } from "lowdb";

const db = new Low(new JSONFile("./src/models/json/pois.json"));
db.data = { pois: [] };

export const poiJsonStore = {
  async getAllPois(filter) {
    await db.read();
    if (filter) {
      const { name, category } = filter;
      const nameFilter = (p) => !name || p.name?.toLowerCase().includes(name?.toLowerCase());
      const categoryFilter = (p) => !category || p.category === category;
      return db.data.pois.filter((p) => nameFilter(p) && categoryFilter(p));
    }
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
    if (index < 0) return;
    db.data.pois[index] = { ...db.data.pois[index], ...changes };
    await db.write();
  },

  async getPoiById(id) {
    await db.read();
    const list = db.data.pois.find((poi) => poi._id === id);
    return list ?? null;
  },

  async deletePoiById(id) {
    await db.read();
    const index = db.data.pois.findIndex((poi) => poi._id === id);
    if (index > -1) db.data.pois.splice(index, 1);
    await db.write();
  },

  async deleteAll() {
    db.data.pois = [];
    await db.write();
  },
};
