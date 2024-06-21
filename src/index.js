//require('dotenv').config({path : './env})

import connectDB from "./db/index.js";
import dotenv from "dotenv";
import {app} from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
    app.on("error", (error) => {
      console.log("Error", err);
      throw error;
    });
  })
  .catch((err) => {
    console.log("Mongo db Connection failed!!!", err);
  });

/*
import express from "express";

const app = express()(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("Error", err);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error", error);
    throw err;
  }
})();
*/
