const EqModel = require('../../models/chart/EqModels')
const EqServer = {
    addEq: async ({ twinCode, twinID, status, space, param }) => {
        return await EqModel.create({
            twinCode, twinID, status, space, param
        })
    },
    getEq: async ({ space,room }) => {
        return await EqModel.find({
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
    updataEq: async ({ twinCode, status, twinID }) => {
        return await EqModel.find({
            $or: [{
                twinCode
            },
            {
                twinID
            }]
        }).updateOne({
            status
        })
    }
}

module.exports = EqServer