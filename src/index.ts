import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let userCount = 0;

interface User {
  socket: WebSocket;
  roomId: String;
}

let allSocket: User[] = [];

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
    const parsedMessage = JSON.parse(message as unknown as string);

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
        if (allSocket[i].roomId == currentMessageRoom ){
            allSocket[i].socket.send(parsedMessage.payload.message)
        }
      }
    }
  });
});
