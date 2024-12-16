"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let userCount = 0;
let allSocket = [];
wss.on("connection", (socket) => {
    userCount = userCount + 1;
    allSocket.push(socket);
    console.log(`The number of user connected is `, userCount);
    socket.on("message", (message) => {
        console.log("message recieved", message.toString());
        for (let i = 0; i < allSocket.length; i++) {
            const s = allSocket[i];
            s.send("messages sent from server " + message.toString());
        }
    });
});
