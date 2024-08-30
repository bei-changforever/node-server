const AirServer = require("../../server/chart/AirServer");
const axios = require("axios");
const AirController = {
    addAirEq: async (req, res) => {
        const { twinCode, twinID, space, floor, status, param } = req.body
        await AirServer.addAirEq({
            twinCode, twinID, space, floor, status, param
        })
        res.send({
            code: 200,
            messgae: "success",
            type: "空调"
        })
    },
    updataAirEq: async (req, res) => {
        const { twinID, param } = req.body.data
        if (param == "开启") {
            let infoData = [
                {
                    twinID,
                    metric: "空调状态",
                    value: 1
                }
            ]
            //发送性能数据
            axios({
                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/dynamics/2415605243681311",
                method: "POST",
                data: infoData
            });

            //发送告警数据
            let arr = [{
                twinID: twinID,
                severity: 4,
                status: 1,
                sourceAlertKey: "运行状态",
                summary: "运行中",
                sourceIdentifier: "运行状态",
                lastOccurrence: "2023-06-25 09:30:00"
            }];
            axios({
                url:"https://thingjsx.thingjs.com/thing/provider/rest/monitor/alarms/2415605243681311",
                method:"POST",
                data: arr
            });
            await AirServer.updataAirEq({
                twinID,
                status: 1
            });
        }
        else {
            let infoData = [
                {
                    twinID,
                    metric: "空调状态",
                    value: 0
                }
            ];
            //发送数据
            axios({
                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/dynamics/2415605243681311",
                method: "POST",
                data: infoData
            });
            //发送告警数据
            let arr = [{
                twinID: twinID,
                severity: 4,
                status: 2,
                sourceAlertKey: "运行状态",
                summary: "运行中",
                sourceIdentifier: "运行状态",
                lastOccurrence: "2023-06-25 09:30:00"
            }];
            axios({
                url:"https://thingjsx.thingjs.com/thing/provider/rest/monitor/alarms/2415605243681311",
                method:"POST",
                data: arr
            });
            await AirServer.updataAirEq({
                twinID,
                status: 0
            });
        }
        res.send({
            code: 200,
            messgae: "success"
        })
    },
    getAir: async (req, res) => {
        const { EqName, floor, space } = req.body;
        let result = await AirServer.getAirEq({
            floor, space
        });
        let normalEq = [];

        let offlineEq = [];
        if (EqName == "空调" && result.length > 0) {
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
        else {
            res.send({
                code: 500,
                message: 'error'
            });
        }
    },
    fakeupdataAllAirEq: async (req, res) => {
        const { space, param } = req.body.data;
        let result = await AirServer.getAirEq({
            space
        });
        let ids = []
        if (space && param == "开启") {
            result.forEach(item => {
                ids.push(item.twinID)
            });
            await AirServer.updataAirEq({
                ids,
                status: 1
            });
            res.send({
                code: 200,
                message: "success"
            });
        }
        else {
            result.forEach(item => {
                ids.push(item.twinID)
            });
            await AirServer.updataAirEq({
                ids,
                status: 0
            });
            res.send({
                code: 200,
                message: "success"
            });
        }
    }
}
    
module.exports = AirController