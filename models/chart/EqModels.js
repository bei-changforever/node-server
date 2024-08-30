const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EqType = {
    twinCode: String,
    twinID: String,
    //1:告警 2:关闭 11:已处理
    status: Number,
    space:String,
    param: String,
    room: String
}

const EqModel = mongoose.model("Eq",new Schema(EqType,{versionKey: false}))

module.exports = EqModel