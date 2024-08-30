const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SmokeType = {
    twinCode: String,
    twinID: String,
    //1:告警 2:关闭 11:已处理
    status: Number,
    space: String,
    floor: String,
    param: String
};

const SmokeModel = mongoose.model("Smoke",new Schema(SmokeType,{versionKey: false}));

module.exports = SmokeModel;