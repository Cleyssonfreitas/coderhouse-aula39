import MongoStore from "connect-mongo";
import {MONGODB_CONNECTION} from "./config.js";

export const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: MONGODB_CONNECTION,
    dbName: 'ecommerce',
    ttl: 15,
  }),
  secret: process.env.AUTH_SECRET,
  resave: false,
  saveUninitialized: false,
}
