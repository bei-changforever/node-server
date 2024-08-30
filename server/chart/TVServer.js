const TVModel = require("../../models/chart/TVModel");

const TVServer = {
    addTV: async ({ twinCode, twinID, space, status,floor, param }) => {
        return await TVModel.create({
            twinCode, twinID, space, status,floor, param
        })
    },
    getTV: async ({ space,floor }) => {
        return await TVModel.find({
            $or:[
                {
                    space 
                },
                {
                    floor
                }
            ]
        })
    },
    updataTV: async ({ twinCode, twinID, status }) => {
        return await TVModel.find({
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
}

module.exports = TVServer;