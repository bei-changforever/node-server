const express = require("express");
const AirRouter = express.Router();
const AirController = require("../../controllers/chart/AirController");

AirRouter.post("/api/addAirEq",AirController.addAirEq);
AirRouter.post("/api/updataAirEq",AirController.updataAirEq);
AirRouter.post("/api/getAir",AirController.getAir);
AirRouter.post("/api/fakeupdataAllAirEq",AirController.fakeupdataAllAirEq);



module.exports = AirRouter;