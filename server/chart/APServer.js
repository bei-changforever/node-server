const APModel = require("../../models/chart/APModel");

const APServer = {
    addAP: async ({ twinCode, twinID, space, floor, status, param }) => {
        return await APModel.create({
            twinCode, twinID, space, floor, status, param
        })
    },
    getAP: async ({space}) => {
        return await APModel.find({
            space
        })
    }
}

module.exports = APServer