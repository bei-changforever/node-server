const express = require("express");
const BuildingsRouter  = express.Router();
const BuildingsController = require('../../controllers/Connect/BuildingsController');
BuildingsRouter.post("/api/into",BuildingsController.intoBuilding);
module.exports = BuildingsRouter;