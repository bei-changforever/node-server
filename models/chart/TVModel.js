const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TVType = {
    twinCode: String,
    twinID: String,
    //1:告警 2:关闭 11:已处理
    status: Number,
    space: String,
    floor: String,
    param: String
};

const TVModel = mongoose.model("TV",new Schema(TVType,{versionKey: false}));

module.exports = TVModel;