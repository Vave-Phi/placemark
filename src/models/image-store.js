/*
 * Copyright (c) 2022.
 */

import * as cloudinary from "cloudinary";
import { writeFileSync } from "fs";
import config from "../config.js";

const credentials = {
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
};

cloudinary.config(credentials);

export const imageStore = {
  getAllImages: async function () {
    const result = await cloudinary.v2.api.resources();
    return result.resources;
  },

  uploadImage: async function (imagefile) {
    await writeFileSync("./public/temp.img", imagefile);
    const response = await cloudinary.v2.uploader.upload("./public/temp.img");
    return response.url;
  },

  deleteImage: async function (img) {
    await cloudinary.v2.uploader.destroy(img, {});
  },
};
