const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AirType = {
    twinCode: String,
    twinID: String,
    //1:告警 2:关闭 11:已处理
    status: Number,
    floor: String,
    space:String,
    param: String,
}
const AirModel = mongoose.model("air",new Schema(AirType,{versionKey: false}));
module.exports = AirModel
