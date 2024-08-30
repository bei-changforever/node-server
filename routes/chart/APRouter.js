const express = require("express");
const APRouter = express.Router();
const APController = require("../../controllers/chart/APController");


APRouter.post("/api/addAP",APController.addAP);
APRouter.post("/api/getAP",APController.getAP);
module.exports = APRouter;