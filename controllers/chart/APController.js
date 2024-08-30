const APServer = require("../../server/chart/APServer");

const APController = {
    addAP: async (req, res) => {
        const { twinCode, twinID, space, floor, status, param } = req.body
        await APServer.addAP({
            twinCode, twinID, space, floor, status, param
        })
        res.send({
            code: 200,
            messgae: "success",
            type: "AP设备"
        })
    },
    getAP: async (req, res) => {
        const { space, EqName } = req.body;
        if (space == "F7" && EqName == "AP设备") {
            let result = await APServer.getAP({
                space
            })

            let normalEq = []      //  关闭：2  
            let alarmEq = []       //  告警：1
            let offlineEq = []     //  离线: 0  

            if (result.length > 0) {
                //综合数据处理
                result.forEach((item) => {
                    if (item.status == 2) {
                        normalEq = [...normalEq, item]
                    }
                    if (item.status == 1) {
                        alarmEq = [...alarmEq, item]
                    }
                    if (item.status == 0) {
                        offlineEq = [...offlineEq, item]
                    }
                })
                //综合数据
                let data = [
                    {
                        key: "在线",
                        value: normalEq.length
                    },
                    {
                        key: "离线",
                        value: offlineEq.length
                    },
                    {
                        key: "告警",
                        value: alarmEq.length
                    }
                ]
                res.send({
                    code: 200,
                    messgae: "success",
                    data
                })
            }
            else {
                res.send({
                    code: 500,
                    messgae: "error"
                })
            }

        }
        else {
            res.send({
                code: 500,
                messgae: "error"
            })
        }

    }
}


// 12.59 5.66 
module.exports = APController;