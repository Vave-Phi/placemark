import dotenv from "dotenv";

dotenv.config();

export default {
  cookie: {
    name: process.env.COOKIE_NAME,
    password: process.env.COOKIE_PASSWORD,
  },
};
