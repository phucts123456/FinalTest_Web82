const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const userController = require("./controllers/user");
const app = express();
const router = require('./routes');
app.use(express.json());
const cloudinary = require('cloudinary').v2;
app.use(cors());
const config = require("dotenv").config({ path: ".env" });

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
app.use(router);

const connectDb = async () => {
    try {
    //   const userName = encodeURIComponent(process.env.MONGO_USERNAME);
    //   const password = encodeURIComponent(process.env.MONGO_PASSWORD);
    //   const cluster = encodeURIComponent(process.env.MONGO_CLUSTER);
    //   const database = encodeURIComponent(process.env.DB);
      await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB}`);
      console.log("Connect DB successfull");
      const isCreateDefaultUserSuccess = await userController.registerDefaultAccout();
      if(isCreateDefaultUserSuccess) {
        console.log("Create default user success. View env file for account info.");
      } else {
        console.log("Create default user fail. Default user existed.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  connectDb();

app.listen('8080', () => {
    console.log("Server is running");
})