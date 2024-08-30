const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ConferenceType = {
    twinCode: String,
    twinID: String,
    //1:告警 2:关闭 11:已处理
    status: Number,
    space:String,
    param: String,
    timeArr: Array
}

const ConferenceModel  = mongoose.model("room",new Schema(ConferenceType,{versionKey: false}))

module.exports = ConferenceModel