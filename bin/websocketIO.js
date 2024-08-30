

function scoketServer(server) {
    const io = require("socket.io")(server, { cors: true });
    let userObj = {}
    io.on('connection', (socket, req) => {
        let heartInteaval = null
        userObj[socket.id] = socket.handshake.query.username
        //    因为是回调函数  socket.emit放在这里可以防止  用户更新列表滞后
        //    ssocket.broadcast.emit('user_list',docs);           //更新用户列表
        //    ssocket.emit('user_list',docs);           //更新用户列表
    
        //监听客户端发送的消息
        socket.on("sendMsg", (msg) => {
            console.log('客户端请求信息', msg);

            // 服务端向客户端发送消息
            io.emit("/api/getNow", {
                code: 200,
                data: "result"
            })
        });

     
        const heartCheck = () => {
            // 等于open, 才会发送心跳检测
            if (socket.connected) {
                io.emit("heart", {
                    message: "心跳检测"
                })
                console.log(socket.connected);
            }
            else {
                clearInterval(heartInteaval)
            }
        }
        heartInteaval = setInterval(heartCheck,5000)

                                                                                                                                         
         // 监听断开事件
         socket.on('disconnect', (reason) => {
            console.log("disconnect reason ", reason)
            //userMap.delete(socket.handshake.query.username)
        })

    });
}

module.exports = scoketServer