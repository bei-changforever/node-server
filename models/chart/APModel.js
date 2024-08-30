const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const APType = {
    twinCode: String,
    twinID: String,
    //1:告警 2:关闭 11:已处理
    status: Number,
    floor: String,
    space:String,
    param: String,
}

const APModel = mongoose.model("AP",new Schema(APType,{versionKey: false}));

module.exports = APModel;