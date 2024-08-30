const AirModel = require("../../models/chart/AirModel");

const AirServer = {
    addAirEq: async ({ twinCode, twinID, space, floor, status, param }) => {
        return await AirModel.create({
            twinCode, twinID, space, floor, status, param
        })
    },
    getAirEq: async ({ space, floor }) => {
        return await AirModel.find({
            $or: [
                {
                    space
                },
                {
                    floor
                }
            ]
        })
    },
    updataAirEq: async ({ ids, status }) => {
        return await AirModel.find({

            twinID: { $in: ids }



        }).updateMany({
            status
        })
    }
}

module.exports = AirServer