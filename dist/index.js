"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let userCount = 0;
let allSocket = [];
// message
/*
{
    "type":"join",
    "payload" : {
        "roomId" : "123",
        "message" : "hi there"
    }
}
*/
wss.on("connection", (socket) => {
    userCount = userCount + 1;
    console.log(`The number of user connected is `, userCount);
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type == "join") {
            allSocket.push({
                socket,
                roomId: parsedMessage.payload.roomId,
            });
        }
        if (parsedMessage.type == "chat") {
            let currentMessageRoom = null;
            for (let i = 0; i < allSocket.length; i++) {
                if (allSocket[i].socket == socket) {
                    currentMessageRoom = allSocket[i].roomId;
                }
            }
            for (let i = 0; i < allSocket.length; i++) {
                if (allSocket[i].roomId == currentMessageRoom) {
                    allSocket[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
});
