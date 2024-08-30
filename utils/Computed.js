const Computed = {
    fullDay: (date) => {
        let year = new Date(date).getFullYear() //年
        let month = new Date(date).getMonth() + 1 //月
        let da = new Date(date).getDate() //日
        month = month > 10 ? month : "0" + month
        da = da > 10 ? da : "0" + da
        return year + "-" + month + "-" + da
    },
    TimeDay: (date) => {
        let h = new Date(date).getHours() //时
        let min = new Date(date).getMinutes() //分
        h = h > 9 ? h : "0" + h
        min = min > 10 ? min : "0" + min
        return h + ":" + min
    },
    statusText: (s, e, n) => {
        if (((s - n) > 0) && ((e - n) > 0)) {
            return "已预约"
        }
        else if (((s - n) < 0) && ((e - n) > 0)) {
            return "进行中"
        }
        else if ((e - n) < 0) {
            return "会议结束"
        }
    }
}

module.exports = Computed