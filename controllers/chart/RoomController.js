
const ConferenceServer = require("../../server/chart/ConferenceServer");
const AirServer = require("../../server/chart/AirServer");
const TVServer = require("../../server/chart/TVServer");
const axios = require("axios");
const LightServer = require("../../server/chart/LightServer");
const Computed = require("../../utils/Computed");

let timer = {};
const RoomController = {
    getRoomStatus: async (req, res) => {
        const { space, roomName } = req.body
        let normalEq = []      //  空闲：2  
        let alarmEq = []       //  空闲：1
        let offlineEq = []     //  会议中: 0  
        let result = await ConferenceServer.getEq({
            space
        })
        if (space == "F7" && roomName == "会议室") {
            const beautifyStatus = (timeArr) => {
                if (timeArr.length == 0) {
                    //空闲
                    return 1
                }
            };
            // time =  new Date().getTime() 获取当前时间时间戳
            const alarmFunction = (item) => {
                switch (item.status) {
                    case 2:
                        normalEq = [...normalEq, item];
                        break;
                    case 1:
                        alarmEq = [...alarmEq, item];
                        break;
                    case 0:
                        offlineEq = [...offlineEq, item];
                        break;
                    default:
                        break;
                }
            };
            let roomStatusArr = [];
            result.forEach(item => {
                // 状态处理
                alarmFunction(item)
                //空预约
                if (item.timeArr.length == 0) {
                    let info = {
                        twinID: item.twinID,
                        metric: "会议室状态",
                        value: beautifyStatus(item.timeArr)
                    }
                    roomStatusArr.push(info)
                };
                //有预约
                if (item.timeArr.length > 0) {
                    item.timeArr.forEach(twinItem => {
                        //会议前1分钟
                        if (((twinItem.startTime - new Date().getTime()) >= 45000) && ((twinItem.startTime - new Date().getTime()) <= 75000)) {
                            let info = {
                                twinID: item.twinID,
                                metric: "会议室状态",
                                value: 1
                            }
                            roomStatusArr.push(info)
                        }
                        //会议中
                        else if ((new Date().getTime() - twinItem.startTime > 0) && (new Date().getTime() - twinItem.endTime < 0)) {
                            let info = {
                                twinID: item.twinID,
                                metric: "会议室状态",
                                value: 0
                            }
                            roomStatusArr.push(info)
                        }
                        //会议后1分钟 延迟10秒 会议结束前1分钟内发送消息  会议结束后20秒后停止发送消息  结束时间 - 现在时间 >= 30000 && 结束时间 - 现在时间 <= 20000
                        else if ((new Date().getTime() - twinItem.endTime >= 0) && (new Date().getTime() - twinItem.endTime <= 20000)) {
                            let info = {
                                twinID: item.twinID,
                                metric: "会议室状态",
                                value: 1
                            }
                            roomStatusArr.push(info)
                        }
                    })
                };
            });
            //综合数据
            let data = [
                {
                    key: "会议中",
                    value: offlineEq.length
                },
                {
                    key: "空闲中",
                    value: alarmEq.length
                }
            ];
            //发送数据
            axios({
                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/dynamics/2415605243681311",
                method: "POST",
                data: roomStatusArr
            });
            //修改表状态
            roomStatusArr.forEach(item => {
                ConferenceServer.updataStatus({
                    twinID: item.twinID,
                    status: item.value
                })
            });
            res.send({
                code: 200,
                messgae: "success",
                type: "会议室",
                data
            });
        }
        else {
            res.send({
                code: 500,
                message: "参数错误"
            })
        }
    },
    addRoom: async (req, res) => {
        //调用server
        const { twinCode, twinID, status, space, param } = req.body;
        await ConferenceServer.addEq({
            twinCode, twinID, status, space, param
        });
        res.send({
            code: 200,
            messgae: "success",
            sqlSpace: param
        })
    },
    //预约
    booking: async (req, res) => {
        // { twinID: '儿童公园', startTime: 1696898400000, endTime: 1696902000000 }
        const { twinID, startTime, endTime } = req.body;
        let time = {
            startTime,
            endTime
        };
        await ConferenceServer.booking(
            {
                twinID, time
            }
        );
        console.log("会议室预约成功,开始计算会议时间==>");
        //用户预约会议
        timer[`${twinID}-${startTime}-${endTime}-开始`] = setInterval(() => {
            //会议开始
            if (((new Date().getTime() - startTime) > 0) && ((new Date().getTime() - endTime) < 0)) {
                let info = [{
                    twinID: twinID,
                    metric: "会议室状态",
                    value: 0  //会议中
                }]
                //发送性能数据
                axios({
                    url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/dynamics/2415605243681311",
                    method: "POST",
                    data: info
                });
                console.log("会议开始==>", `${twinID}-${startTime}-${endTime}-开始`);
                //先清除会议计算
                clearInterval(timer[`${twinID}-${startTime}-${endTime}-开始`]);
            }
        }, 1000);
        //会议结束
        timer[`${twinID}-${startTime}-${endTime}-结束`] = setInterval(() => {
            if ((new Date().getTime() - endTime >= 0) && (new Date().getTime() - endTime <= 20000)) {

                let info = [{
                    twinID: twinID,
                    metric: "会议室状态",
                    value: 1
                }];
                axios({
                    url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/dynamics/2415605243681311",
                    method: "POST",
                    data: info
                });
                console.log("会议结束,关闭模式==>", `${twinID}-${startTime}-${endTime}-结束`);
                clearInterval(timer[`${twinID}-${startTime}-${endTime}-结束`]);
            }
        }, 1000);
        res.send({
            code: 200,
            messgae: "success",
            type: "预约会议室"
        });
    },
    getBooking: async (req, res) => {
        const { twinID } = req.body
        let result = await ConferenceServer.getEq({
            twinID
        })
        if (result.length >= 1) {
            let stempArr = []
            result[0].timeArr.forEach(item => {
                let info = {
                    date: Computed.fullDay(item.startTime),
                    name: `项目研发组-${twinID}`,
                    time: Computed.TimeDay(item.startTime) + "~" + Computed.TimeDay(item.endTime),
                    status: Computed.statusText(item.startTime, item.endTime, new Date().getTime()),
                    fullTime: {
                        startTime: item.startTime,
                        endTime: item.endTime
                    }
                }
                if (Computed.statusText(item.startTime, item.endTime, new Date().getTime()) !== "会议结束") {
                    stempArr.unshift(info)
                }
            });
            res.send({
                code: 200,
                message: "success",
                type: "查询预约时间",
                data: stempArr
            });
        }
        else {
            res.send({
                code: 500,
                message: "error",
                type: "查询预约时间失败，查询无此字段",
            });
        }
    },
    //一键会议模式
    OneClickOn: async (req, res) => {
        const { twinID, fullTime } = req.body;
        console.log(new Date() + twinID + "------logger------当前时间执行一键会议");
        const { startTime, endTime } = fullTime;
        let Air = await AirServer.getAirEq({
            space: twinID
        });
        let room = await ConferenceServer.getEq({
            twinID
        });
        let TV = await TVServer.getTV({
            space: twinID
        });
        let Light = await LightServer.getEq({
            room: twinID
        });
        let LightData = [];
        Light.forEach(item => {
            let obj = {
                twinID: item.twinID,
                metric: "灯光状态",
                value: 1
            }
            LightData.push(obj);

        });
        // id,起始时间,终止时间,起始时间到达启动，终止时间到达关闭
        if (Air.length > 0 && TV.length > 0 && Light.length > 0) {
            room[0].timeArr.forEach(item => {
                if (item.startTime == startTime && item.endTime == endTime) {
                    //会议计算
                    timer[`${Air[0].twinID}-${startTime}`] = setInterval(() => {
                        //会议开始
                        if (((new Date().getTime() - startTime) > 0) && ((new Date().getTime() - endTime) < 0)) {
                            let infoData = [
                                {
                                    twinID: Air[0].twinID,
                                    metric: "空调状态",
                                    value: 1
                                },
                                {
                                    twinID: TV[0].twinID,
                                    metric: "屏幕状态",
                                    value: 1
                                },
                                ...LightData
                            ];


                            console.log("会议开始,开启的设备==>" + JSON.stringify(infoData));
                            //发送告警数据
                            let arr = [{
                                twinID: Air[0].twinID,
                                severity: 3,
                                status: 1,
                                sourceAlertKey: "运行状态",
                                summary: "运行中",
                                sourceIdentifier: "运行状态",
                                lastOccurrence: "2023-06-25 09:30:00"
                            }];
                            axios({
                                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/alarms/2415605243681311",
                                method: "POST",
                                data: arr
                            });
                            axios({
                                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/dynamics/2415605243681311",
                                method: "POST",
                                data: infoData
                            });
                            AirServer.updataAirEq({
                                twinID: Air[0].twinID,
                                status: 1
                            });
                            TVServer.updataTV({
                                twinID: TV[0].twinID,
                                status: 1
                            });
                            LightServer.updataEq({
                                twinID: Light[0].twinID,
                                status: 2
                            });
                            console.log("会议开始,启动模式==>", `${Air[0].twinID}-${startTime}`);
                            //先清除会议计算
                            clearInterval(timer[`${Air[0].twinID}-${startTime}`]);
                        }

                    }, 1000);
                    //会议结束
                    timer[`${Air[0].twinID}-${endTime}`] = setInterval(() => {
                        if ((new Date().getTime() - endTime >= 0) && (new Date().getTime() - endTime <= 20000)) {
                            //会议结束 自动关闭空调  
                            let infoData = [
                                {
                                    twinID: Air[0].twinID,
                                    metric: "空调状态",
                                    value: 0
                                }
                            ];
                            //发送告警数据
                            let arr = [{
                                twinID: Air[0].twinID,
                                severity: 3,
                                status: 2,
                                sourceAlertKey: "运行状态",
                                summary: "运行中",
                                sourceIdentifier: "运行状态",
                                lastOccurrence: "2023-06-25 09:30:00"
                            }];
                            axios({
                                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/alarms/2415605243681311",
                                method: "POST",
                                data: arr
                            });
                            axios({
                                url: "https://thingjsx.thingjs.com/thing/provider/rest/monitor/dynamics/2415605243681311",
                                method: "POST",
                                data: infoData
                            });
                            AirServer.updataAirEq({
                                twinID: Air[0].twinID,
                                status: 0
                            });
                            console.log("会议结束,关闭模式==>", `${Air[0].twinID}-${endTime}`);
                            clearInterval(timer[`${Air[0].twinID}-${endTime}`]);
                        }
                    }, 1000);

                }
            })
            res.send({
                code: 200,
                message: "success"
            });
        }
        else {
            res.send({
                code: 500,
                messgae: "error"
            });
        };
    },
    //获取会议历史
    getMeetingHistory: async (req, res) => {
        const { param } = req.body;
        let result = await ConferenceServer.getEq({
            param
        });
        let infoData = []
        if (result.length > 0) {
            result.forEach(item => {
                let obj = {
                    roomName: item.twinID,
                    tableData: item.timeArr.map(ele => {
                        return {
                            date: Computed.fullDay(ele.startTime),
                            name: `项目研发组-${item.twinID}`,
                            time: Computed.TimeDay(ele.startTime) + "~" + Computed.TimeDay(ele.endTime),
                            status: Computed.statusText(ele.startTime, ele.endTime, new Date().getTime()),
                            fullTime: {
                                startTime: ele.startTime,
                                endTime: ele.endTime
                            }
                        }
                    })
                };
                infoData = [obj, ...infoData];
            });
            res.send({
                code: 200,
                message: "success",
                data: infoData
            });
        }
        else {
            res.send({
                code: 500,
                messgae: "error"
            });
        };
    },
    //删除历史会议
    deleteHistoryMeeting: async (req, res) => {
        const { twinID, fullTime } = req.body;
        const { startTime, endTime } = fullTime;
        let result = await ConferenceServer.getEq({
            twinID
        });
        if (result.length > 0) {
            let newArr = result[0].timeArr.filter((item) => {
                return item.startTime !== startTime && item.endTime !== endTime
            });
            if (timer[`${twinID}-${startTime}`] || timer[`${twinID}-${endTime}`]) {
                clearInterval(timer[`${twinID}-${startTime}`]);
                clearInterval(timer[`${twinID}-${endTime}`]);
            }
            await ConferenceServer.deleteTime({
                twinID,
                timeArr: newArr
            });
            res.send({
                code: 200,
                message: "success"
            });
        }
        else {
            res.send({
                code: 500,
                message: "error"
            })
        }
    }
}

module.exports = RoomController;