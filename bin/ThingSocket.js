const WebSocket = require("ws");

WebSocket.binaryType = 'arraybuffer';


const initWebsocket = {
    wss: null,
    WebSocketType: {
        thing: "thing",
        web: "web"
    },
    WebSocketserver: (server) => {
        let that = this
        this.wss = new WebSocket.Server({ server });
        this.wss.on('connection', function connection(socket, req) {
            const myURL = new URL(req.url, "http://127.0.0.1:3000");
            const playLoad = myURL.searchParams.get("token");
            if (playLoad) {
                console.log("连接用户" + playLoad);
                socket.send(JSON.stringify(playLoad, "客户端连接成功"))
                socket.user = playLoad
            };
            //向客户端发送
            socket.on('message', (data) => {
                const msgObj = JSON.parse(data);
                //
                that.wss.clients.forEach(client => {
                    if (client.user === msgObj.toguys && client.readyState === WebSocket.OPEN) {
                        console.log(`--${playLoad}--和--${msgObj.toguys}--私聊--` + JSON.stringify(msgObj));
                        client.send(JSON.stringify(msgObj.data), { binary: false })
                    }
                });

            });
            //服务器错误
            socket.on('error', console.error);
            //用户离开
            socket.on("close", () => {
                that.wss.clients.delete(socket.user)
                console.log(playLoad + '离开');
            });
        });
    },
    ThingToSocket: (msgObj) => {
        this.wss.clients.forEach(client => {
            if (client.user === "thing" && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(msgObj), { binary: false })
            }
        })
    },
    WebToSocketToThing: (msgObj) => {
        this.wss.clients.forEach(client => {
            if (client.user === "web" && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(msgObj), { binary: false })
            }
        })
    }

}

module.exports = initWebsocket;

