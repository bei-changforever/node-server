const WebSocket = require("ws");

WebSocket.binaryType = 'arraybuffer';


const clients = new Set()


const WebSocketType = {
    Error: 0,//错误
    GroupList: 1, //获取列表
    GroupChat: 2, //群聊
    SingleChat: 3 //私聊
};

const WebSocketserver = (server) => {
    const wss = new WebSocket.Server({ server });
    //监听客户端连接
    wss.on('connection', function connection(socket, req) {
        const myURL = new URL(req.url, "http://127.0.0.1:3000");
        const playLoad = myURL.searchParams.get("token");
        if (playLoad) {
            console.log("连接用户" + playLoad);
            socket.send(createMessage(WebSocketType.GroupChat, playLoad, "客户端连接成功"))
            socket.user = playLoad
            clients.add(socket); 
        };  
        //向客户端发送
        socket.on('message', (data) => {
            const msgObj = JSON.parse(data);
            switch (msgObj.type) {
                case WebSocketType.GroupList:
                    socket.send(createMessage(WebSocketType.GroupList, null, JSON.stringify(Array.from(socket.clients).map(item => item.user))));
                    break;
                case WebSocketType.GroupChat:
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            console.log("群聊--" + JSON.stringify(msgObj.data));
                            client.send(JSON.stringify(msgObj.data), { binary: false })
                        }
                    });
                    break;
                case WebSocketType.SingleChat:
                    wss.clients.forEach((client) => {
                        if (client.user === msgObj.to && client.readyState === WebSocket.OPEN) {
                            console.log("私聊--" + JSON.stringify(msgObj));
                            client.send(createMessage(WebSocketType.SingleChat, socket.user, msgObj.data, msgObj.serverName), { binary: false })
                        }
                    });
                    break;
                default:
                    break;
            }
        });
        //服务器错误
        socket.on('error', console.error);
        //用户离开
        socket.on("close", () => {
            wss.clients.delete(socket.user)
            console.log(playLoad+'离开');
        });
    });
};

const createMessage = (type, user, data, serverName) => {
    return JSON.stringify({
        type,
        user,
        data,
        serverName
    })
};

const socketToThing = (msgObj) => {
    clients.forEach((client) => {
       
        if (client.readyState === WebSocket.OPEN) {
   
            console.log("群聊--" + JSON.stringify(msgObj));
            client.send(JSON.stringify(msgObj), { binary: false })

        }
    });
}


// module.exports = {WebSocketserver,socketToThing};

