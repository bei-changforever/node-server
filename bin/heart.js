const WebSocket = require("ws");
WebSocket.binaryType = 'arraybuffer'
function WebSocketserver(server) {
    const wss = new WebSocket.Server({ server });
    const state = {
        HEART: 1,
        MESSAGE: 2
    }
    //监听客户端连接
    wss.on('connection', function connection(socket, req) {

        //客户端发送
        socket.on('message', function message(data) {
            // console.log('received: %s', data);


            wss.clients.forEach(client => {
                client.send(data.toString());
            })
            console.log("我是服务端 发送给客户端的消息" + data.toString());

        });
        socket.on('error', console.error);
        //发送心跳包
        SendHeartPackage(socket, state);
    });
};

function SendHeartPackage(socket, state) {
    let timer = null
    timer = setInterval(() => {
        if (socket.readyState == WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: state.HEART,
                message: "心跳检测"
            }))
        }
        else {
            clearInterval(timer)
        }
    }, 5000)

    socket.onclose = () => {
        console.log("客户端断开连接");
        clearInterval(timer)
    }
}
module.exports = WebSocketserver;