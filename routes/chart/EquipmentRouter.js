var express = require('express')
var EqRouter = express.Router()
const EqController = require("../../controllers/chart/EqController")

EqRouter.post("/api/updataAllEq",EqController.updataAllEq);
EqRouter.post('/api/getEq',EqController.getEq);
EqRouter.post('/api/addEq',EqController.addEq);
EqRouter.post('/api/updataEq',EqController.updataEq);
EqRouter.post("/api/performance",EqController.performance);
EqRouter.post("/api/fakeUpdata",EqController.fakeUpdata);
EqRouter.post("/api/getLightEqStatus",EqController.getLightEqStatus);
EqRouter.post("/api/smokeStatus",EqController.smokeStatus);

module.exports = EqRouter
