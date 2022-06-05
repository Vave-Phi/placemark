import axios from "axios";

import { serviceUrl } from "../fixtures.js";

export const placemarkService = {
  placemarkUrl: serviceUrl,

  async authenticate(user) {
    const response = await axios.post(`${this.placemarkUrl}/api/users/authenticate`, user);
    axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
    return response.data;
  },

  clearAuth() {
    axios.defaults.headers.common.Authorization = "";
  },

  async createUser(user) {
    const res = await axios.post(`${this.placemarkUrl}/api/users`, user);
    return res.data;
  },

  async getUser(id) {
    const res = await axios.get(`${this.placemarkUrl}/api/users/${id}`);
    return res.data;
  },

  async getAllUsers() {
    const res = await axios.get(`${this.placemarkUrl}/api/users`);
    return res.data;
  },

  async deleteUserById(id) {
    const res = await axios.delete(`${this.placemarkUrl}/api/users/${id}`);
    return res.data;
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${this.placemarkUrl}/api/users`);
    return res.data;
  },

  async createPoi(poi) {
    const res = await axios.post(`${this.placemarkUrl}/api/pois`, poi);
    return res.data;
  },

  async getPoi(id) {
    const res = await axios.get(`${this.placemarkUrl}/api/pois/${id}`);
    return res.data;
  },

  async getAllPois() {
    const res = await axios.get(`${this.placemarkUrl}/api/pois`);
    return res.data;
  },

  async updatePoi(id, changes) {
    const res = await axios.put(`${this.placemarkUrl}/api/pois/${id}`, changes);
    return res.data;
  },

  async deletePoiById(id) {
    const res = await axios.delete(`${this.placemarkUrl}/api/pois/${id}`);
    return res.data;
  },

  async deleteAllPois() {
    const res = await axios.delete(`${this.placemarkUrl}/api/pois`);
    return res.data;
  },
};
