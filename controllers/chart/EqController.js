const EqServer = require('../../server/chart/EqServer');
const LightServer = require("../../server/chart/LightServer");
const axios = require("axios");
const EqController = {
    //设备数据统计
    getEq: async (req, res) => {
    
        const { space, EqName } = req.body
        let result = []
        let normalEq = []      //  关闭：2  
        let alarmEq = []       //  告警：1
        let offlineEq = []     //  离线: 0  
        switch (EqName) {
            case "摄像头":
                result = await EqServer.getEq({
                    space
                });
                break;
            case "灯光设备":
                result = await LightServer.getEq({
                    space
                });
                break;
            default:
                break;
        }
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
        
            //初始化性能数据
            let performanceData = []
            result.forEach(item => {
                if (EqName == "灯光设备") {
                
                    let obj2 = {
                        twinID: item.twinID,
                        metric: "灯光状态",
                        value: item.status == 2 ? 1 : 0
                    }
                
                    performanceData.push(obj2)
                }
            });
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
            ];
            if (space == "F7") {
                switch (EqName) {
                    case "摄像头":
                        res.send({
                            code: 200,
                            messgae: "success",
                            type: "摄像头",
                            data
                        });
                        break;
                    case "灯光设备":
                      
                        await axios({
                            url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/dynamics/2415605243681311",
                            method: "POST",
                            data: performanceData
                        });
                        res.send({
                            code: 200,
                            messgae: "success",
                            type: "灯光设备",
                            data
                        });
                        break;
                    default:
                        break;
                }
            }
        }
        else {
            res.send({
                code: 500,
                message: "暂无数据"
            })
        }
    },
    //添加新设备
    addEq: async (req, res) => {
        //调用server
        const { twinCode, twinID, status, space, param } = req.body
        switch (param) {
            case "摄像头":
                await EqServer.addEq({
                    twinCode, twinID, status, space, param
                });
                break;
            case "灯光设备":
                await LightServer.addEq({
                    twinCode, twinID, status, space, param
                });
                break;
            default:
                break;
        }
        res.send({
            code: 200,
            messgae: "success",
            sqlSpace: param
        })
    },
    //告警数据推送
    updataEq: async (req, res) => {
        // 如需关闭推送的告警信息，至少需推送参数包括twinID/twinCode、sourceAlertKey、sourceIdentifier 以确定该条孪生体告警数据，且推送status=2，关闭该条告警。
        const { param2, param3 } = req.body;
        let alarmData = [];
        if (param2 == "开启") {
            const { twinCode, twinID, status, severity, sourceAlertKey, summary, sourceIdentifier, lastOccurrence } = req.body
            let info = {
                twinID: twinID ? twinID : twinCode,
                severity: severity ? severity : 1,
                sourceAlertKey,
                summary,
                status: status ? status : 1,
                sourceIdentifier,
                lastOccurrence
            };
            alarmData = [...alarmData, info];
            axios({
                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/alarms/2415605243681311",
                method: "POST",
                data: alarmData
            });
            if (param3 == "摄像头") {
                await EqServer.updataEq({
                    twinCode,
                    twinID,
                    status
                })
            };
        }
        else if (param2 == "关闭") {
            const { param1, param3 } = req.body;
            let StringtoJsonObject = JSON.parse(param1);
            let twinCode = StringtoJsonObject.id.split("_")[0];
            if (param1) {
                let alarmData = [{
                    twinCode,
                    severity: StringtoJsonObject._ALARMLEVEL_,
                    status: 2,
                    sourceAlertKey: StringtoJsonObject.kpiName ? StringtoJsonObject.kpiName : StringtoJsonObject.ALARM_INFORMATION,
                    summary: StringtoJsonObject.ALARM_INFORMATION,
                    sourceIdentifier: StringtoJsonObject.sourceEventId,
                    lastOccurrence: StringtoJsonObject.ALARM_TIME
                }];
                axios({
                    url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/alarms/2415605243681311",
                    method: "POST",
                    data: alarmData
                });
                if (param3 == "摄像头") {
                    await EqServer.updataEq({
                        twinCode,
                        status: 2
                    });
                };
            };
        };
        res.send({
            code: 200,
            messgae: "success"
        });
    },
    //性能数据推送
    performance: async (req, res) => {
        const { twinID, param, param2 } = req.body.data
        if (param2 == "单个控制" && param == "开启") {
            let info = [
                {
                    twinID,
                    metric: "灯光状态",
                    value: 1
                }
            ];
        
            await axios({
                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/dynamics/2415605243681311",
                method: "POST",
                data: info
            });
      
            await LightServer.updataEq({
                twinID,
                status: 2
            });
            res.send({
                code: 200,
                message: "success"
            });
        }
        else if (param2 == "单个控制" && param == "关闭") {
            let info = [
                {
                    twinID,
                    metric: "灯光状态",
                    value: 0
                }
            ];
       
            await axios({
                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/dynamics/2415605243681311",
                method: "POST",
                data: info
            });
          
            await LightServer.updataEq({
                twinID,
                status: 0
            });
            res.send({
                code: 200,
                message: "success"
            });
        }
    },
    updataAllEq: (req, res) => {
        const { twinIDs, param } = req.body.data;
        let loopArray = JSON.parse(twinIDs);
        let ids = loopArray.map(item => {
            return item.id
        });
        let options = [];
      
        ids.forEach(item => {
            let optionsObj = {
                twinID: item,
                metric: "运行状态",
                value: param == "开启" ? 1 : 0
            };
         
            options.push(optionsObj);
      
        })
        // 推送性能数据
        axios({
            url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/dynamics/2415605243681311",
            method: "POST",
            data: options
        });
      

        //双数据推送完毕发送后端事件
        LightServer.updataAllEq({
            ids,
            status: param == "开启" ? 2 : 0
        });

        res.send({
            code: 200,
            message: "success"
        });
    },
    fakeUpdata: async (req, res) => {
        const { twinIDS, param } = req.body.data;
        let loopArray = JSON.parse(twinIDS);
        let ids = loopArray.map(item => {
            return item.id
        });
        let info = [];

        // param: 开启 / 关闭 
        if (param == "开启") {
            ids.forEach(item => {
                let obj1 = {
                    twinID: item,
                    metric: "灯光状态",
                    value: 1
                };
          
                info.push(obj1);
       
            });
            await axios({
                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/dynamics/2415605243681311",
                method: "POST",
                data: info
            });
          
            await LightServer.updataAllEq({
                ids,
                status: 2
            });
        }
        else if (param == "关闭") {
            ids.forEach(item => {
                let obj1 = {
                    twinID: item,
                    metric: "灯光状态",
                    value: 0
                };
            
                info.push(obj1);
         
            });

            await axios({
                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/dynamics/2415605243681311",
                method: "POST",
                data: info
            });
          
            await LightServer.updataAllEq({
                ids,
                status: 0
            });
        };
        res.send({
            code: 200,
            message: "success"
        });
    },
    getLightEqStatus: async (req, res) => {
        const { space, EqName } = req.body[0];
        let data = [];
        if (space == "F7" && EqName == "灯光设备") {
            let result = await LightServer.getEq({
                space
            });
            result.forEach(item => {
                let info =
                {
                    title: item.twinID,
                    text: item.status == 2 ? "运行" : "离线"
                }
                data.push(info)
            })
        };
        res.send({
            code: 200,
            message: "success",
            data
        });

    },
    //烟雾传感器性能数据推送
    smokeStatus: async (req, res) => {
        const { param2 } = req.body;
        if (param2 == "关闭") {
            //推送着火
            let arr = [
                {
                    "twinID": "样例花瓶",
                    "metric": "着火",
                    "value": 0
                },
                {
                    "twinID": "烟雾传感器",
                    "metric": "烟感状态",
                    "value": 0
                }
            ];

            let info = [{
                twinID: "烟雾传感器",
                severity: 1,
                sourceAlertKey: "着火",
                summary: "着火",
                status: 2,
                sourceIdentifier: "着火",
                lastOccurrence: "2022-08-10 08:24:45"
            }];

            axios({
                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/dynamics/2415605243681311",
                method: 'POST',
                data: arr
            });

            axios({
                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/alarms/2415605243681311",
                method: "POST",
                data: info
            });

            //推送告警
        }
        else {
            //推送着火
            let arr = [
                {
                    "twinID": "样例花瓶",
                    "metric": "着火",
                    "value": 1
                },
                {
                    "twinID": "烟雾传感器",
                    "metric": "烟感状态",
                    "value": 1
                }
            ];

            let info = [{
                twinID: "烟雾传感器",
                severity: 1,
                sourceAlertKey: "着火",
                summary: "着火",
                status: 1,
                sourceIdentifier: "着火",
                lastOccurrence: "2022-08-10 08:24:45"
            }];

            axios({
                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/dynamics/2415605243681311",
                method: 'POST',
                data: arr
            });

            axios({
                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/alarms/2415605243681311",
                method: "POST",
                data: info
            });

            //推送告警
        }

        res.send({
            code: 200,
            messgae: "success"
        })
    }
}


module.exports = EqController