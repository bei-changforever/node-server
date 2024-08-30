const initWebSocket = require('./socket.config');


const pro = (timer, cb) => {
    return new Promise(resolve => {
        setTimeout(() => {
            cb()
            resolve()
        }, timer)

    })
}

const step = async (data) => {
    await pro(10, data.init);
    await pro(600, data.send);
    await pro(20000, data.close);
}



module.exports = step