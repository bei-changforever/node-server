const ConferenceModel = require("../../models/chart/Conference");


const ConferenceServer = {
    addEq: async ({ twinCode, twinID, status, space, param }) => {
        return await ConferenceModel.create({
            twinCode, twinID, status, space, param
        })
    },
    getEq: async ({ space, twinID, param }) => {
        return await ConferenceModel.find({
            $or: [
                {
                    space
                },
                {
                    twinID
                },
                {
                    param
                }
            ]
        })
    },
    booking: async ({ twinID, time }) => {
        return await ConferenceModel.find({
            twinID
        }).updateMany({
            $push: {
                timeArr: time
            }
        })
    },
    updataStatus: async ({ twinID, status }) => {
        return await ConferenceModel.find({
            twinID
        }).updateMany({
            status
        })
    },
    deleteTime: async ({twinID,timeArr}) => {
        return await ConferenceModel.find({
            twinID
        }).updateOne({
            timeArr
        })
    }
}


module.exports = ConferenceServer