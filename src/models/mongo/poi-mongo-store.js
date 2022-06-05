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
    delete poi.weather;
    const poiObj = await Poi.create(poi);
    return this.getPoiById(poiObj._id);
  },

  async updatePoiById(id, changes) {
    delete changes.weather;
    if (id?.length !== 24) {
      return null;
    }
    return Poi.findByIdAndUpdate(id, changes, { new: true, lean: true });
  },

  async increment(id, field) {
    return this.updatePoiById(id, { $inc: { [field]: 1 } });
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
