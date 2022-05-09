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
