
const WebSocket = require("ws")




const initWebSocket = {
    ws: {},
    setWs: (newWs) => {
        this.ws = newWs
    },
    initWs: (playload) => {
        this.ws = new WebSocket(`ws://127.0.0.1:3000?token=${playload}`);
        this.ws.onopen = this.websocketOnopen;
        this.ws.onmessage = this.websocketOnmessage;
        this.ws.onerror = this.websocketOnerror;
        this.ws.onclose = this.websocketOnclose;

    },
    websocketOnopen: () => {
        console.log("WebSocket连接成功");
    },
    websocketOnmessage: (event) => {
        let data = JSON.parse(event.data)
        console.log(data);
    },
    websocketOnerror: () => {
        console.log("WebSocket连接发生错误");
    },
    websocketOnclose: (e) => {
        console.log("connection closed (" + e.code + ")");
    },
    websocketSend: (data) => {
    
            this.ws.send(JSON.stringify(data))
   
    },
    finsh: () => {
        this.ws.close()
    }
}




module.exports = initWebSocket;
