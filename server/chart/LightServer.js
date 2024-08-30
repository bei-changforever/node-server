const LightModel = require("../../models/chart/LightModel");
const LightServer = {
    addEq: async ({ twinCode, twinID, status, space, param }) => {
        return await LightModel.create({
            twinCode, twinID, status, space, param
        })
    },
    getEq: async ({ space,room }) => {
        return await LightModel.find({
            $or:[
                {
                    space
                },
                {
                    room
                }
            ]
        })
    },
    updataEq: async ({ twinCode, twinID, status }) => {
        return await LightModel.find({
            $or: [{
                twinCode
            },
            {
                twinID
            }]
        }).updateOne({
            status
        })
    },
    updataAllEq: async ({ids,status}) => {
        return await LightModel.find({
            twinID : {$in:ids}
        }).updateMany({
            status
        })
    }
}

module.exports = LightServer