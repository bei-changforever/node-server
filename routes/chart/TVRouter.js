const express = require("express");
const TVRouter = express.Router();
const TVController = require('../../controllers/chart/TVController');



TVRouter.post("/api/addTV",TVController.addTV);
TVRouter.post("/api/getTV",TVController.getTV)
TVRouter.post("/api/updataTV",TVController.updataTV);

module.exports = TVRouter