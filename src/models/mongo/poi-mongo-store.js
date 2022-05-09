import { Poi } from "./poi.js";

export const poiMongoStore = {
  async getAllPois(filter) {
    return Poi.find(filter).lean();
  },

  async getPoiById(id) {
    if (id) {
      return Poi.findOne({ _id: id }).lean();
    }
    return null;
  },

  async addPoi(poi) {
    const poiObj = await Poi.create(poi);
    return this.getPoiById(poiObj._id);
  },

  async updatePoiById(id, changes) {
    console.log(id.length);
    if (id.length !== 12) {
      return null;
    }
    if (id) {
      return Poi.findByIdAndUpdate(id, changes, { new: true, lean: true });
    }
    return null;
  },

  async deletePoiById(id) {
    try {
      await Poi.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAll() {
    await Poi.deleteMany({});
  },
};
