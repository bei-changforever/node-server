const TVServer = require("../../server/chart/TVServer");

const axios = require("axios");
const TVController = {
    addTV: async (req, res) => {

        await TVServer.addTV({
            ...req.body
        })
        res.send({
            code: 200,
            message: "success"
        })
    },
    getTV: async (req, res) => {
        const { EqName, floor, space } = req.body
        if (EqName == "会议室屏幕") {
            let result = await TVServer.getTV({
                floor, space
            });
            let normalEq = []
         
            let offlineEq = []
            if (result.length > 0) {


                result.forEach((item) => {
                    if (item.status == 1) {
                        normalEq = [...normalEq, item]
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
                    }
                ]



                res.send({
                    code: 200,
                    messgae: "success",
                    type: "空调设备",
                    data
                });




            }
        }
        else {
            res.send({
                code: 500,
                messgae: "error"
            })
        }
    },
    updataTV: async (req, res) => {
        const { twinID, param } = req.body.data
        if (param == "开启") {
            let infoData = [
                {
                    twinID,
                    metric: "屏幕状态",
                    value: 1
                }
            ]
            //发送数据
            axios({
                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/dynamics/2415605243681311",
                method: "POST",
                data: infoData
            })
            await TVServer.updataTV({
                twinID,
                status: 1
            })
        }
        else {
            let infoData = [
                {
                    twinID,
                    metric: "屏幕状态",
                    value: 0
                }
            ]
            //发送数据
            axios({
                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/dynamics/2415605243681311",
                method: "POST",
                data: infoData
            })
            await TVServer.updataTV({
                twinID,
                status: 0
            })
        }
        res.send({
            code: 200,
            messgae: "success"
        })
    }
};

module.exports = TVController;