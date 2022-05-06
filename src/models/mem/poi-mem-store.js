import { v4 } from "uuid";

let pois = [];

export const poiMemStore = {
  async getAllPois(filter) {
    if (filter) {
      const { name, category } = filter;
      const nameFilter = (p) => !name || p.name?.toLowerCase().includes(name?.toLowerCase());
      const categoryFilter = (p) => !category || p.category === category;
      return pois.filter((p) => nameFilter(p) && categoryFilter(p));
    }
    return pois;
  },

  async addPoi(poi) {
    poi._id = v4();
    pois.push(poi);
    return poi;
  },

  async getPoiById(id) {
    const poi = pois.find((p) => p._id === id);
    return poi ?? null;
  },

  async updatePoiById(id, changes) {
    const index = pois.findIndex((p) => p._id === id);
    if (index < 0) return;
    pois[index] = { ...pois[index], ...changes };
  },

  async deletePoiById(id) {
    const index = pois.findIndex((poi) => poi._id === id);
    if (index !== -1) pois.splice(index, 1);
  },

  async deleteAll() {
    pois = [];
  },
};
