import dotenv from "dotenv";

dotenv.config();

export default {
  cookie: {
    name: process.env.COOKIE_NAME,
    password: process.env.COOKIE_PASSWORD,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
  },
  openWeatherMap: {
    version: process.env.OWM_VERSION,
    apiKey: process.env.OWM_KEY,
  },
};
