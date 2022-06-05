import { User } from "./user.js";

export const userMongoStore = {
  async getAllUsers() {
    return User.find().lean();
  },

  async getUserById(id) {
    if (id) {
      return User.findOne({ _id: id }).lean();
    }
    return null;
  },

  async addUser(user) {
    const userObj = await User.create(user);
    return this.getUserById(userObj._id);
  },

  async getUserByEmail(email) {
    return User.findOne({ email: email }).lean();
  },

  async updateUserById(id, changes) {
    if (id?.length !== 24) {
      return null;
    }
    return User.findByIdAndUpdate(id, changes, { lean: true });
  },

  async addVisitedPoi(id, poiId) {
    return this.updatePoiById(id, { $push: { visitedPois: poiId } });
  },

  async removeVisitedPoi(id, poiId) {
    return this.updatePoiById(id, { $pull: { visitedPois: poiId } });
  },

  async deleteUserById(id) {
    try {
      await User.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAll() {
    await User.deleteMany({});
  },
};

// TODO update user (inc/dec visited array)
// TODO frontend visited button depending on visited array
// TODO Tests for user update and inc dec
