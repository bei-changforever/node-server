var express = require('express')
const RoomRouter = express.Router()
const RoomController = require("../../controllers/chart/RoomController");

RoomRouter.post("/api/getRoomStatus",RoomController.getRoomStatus);
RoomRouter.post("/api/booking",RoomController.booking);
RoomRouter.post("/api/addRoom",RoomController.addRoom);
RoomRouter.post("/api/getBooking",RoomController.getBooking);
RoomRouter.post("/api/OneClickOn",RoomController.OneClickOn);
RoomRouter.post("/api/getMeetingHistory",RoomController.getMeetingHistory);
RoomRouter.post("/api/deleteHistoryMeeting",RoomController.deleteHistoryMeeting);
module.exports = RoomRouter