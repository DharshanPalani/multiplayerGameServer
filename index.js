import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";

const expressApplication = express();
const httpServer = http.createServer(expressApplication);
const SERVER_PORT = 3000;

const roomMap = new Map();
const webSocketServer = new WebSocketServer({ server: httpServer });

expressApplication.use(cors());
expressApplication.use(express.json());

expressApplication.get("/", (request, response) => {
  response.send("WebSocket chat server is running");
});

webSocketServer.on("connection", (clientConnection) => {
  clientConnection.username = null;
  clientConnection.currentRoom = null;

  clientConnection.on("message", (incomingMessage) => {
    let parsedData;
    try {
      parsedData = JSON.parse(incomingMessage);
    } catch (error) {
      console.error("Failed to parse message as JSON:", error);
      return;
    }

    const { type } = parsedData;

    switch (type) {
      case "set_username":
        assignUsername(clientConnection, parsedData);
        break;

      case "create_room":
        joinRoom(clientConnection, parsedData.room, true);
        break;

      case "join_room":
        joinRoom(clientConnection, parsedData.room, false);
        break;

      case "chat":
        broadcastMessageToRoom(clientConnection, parsedData.message);
        break;

      default:
        console.log(
          `Received unknown message type from ${
            clientConnection.username || "unknown"
          }:`,
          parsedData
        );
        break;
    }
  });

  clientConnection.on("close", () => {
    console.log(
      `Client disconnected: ${clientConnection.username || "unknown"}`
    );
    removeClientFromCurrentRoom(clientConnection);
  });
});

function assignUsername(clientConnection, data) {
  clientConnection.username = data.username;
  console.log(`Username assigned: ${clientConnection.username}`);
}

function joinRoom(clientConnection, roomName, isCreatingRoom = false) {
  if (!roomName) return;

  removeClientFromCurrentRoom(clientConnection);

  if (!roomMap.has(roomName)) {
    if (!isCreatingRoom) return;
    roomMap.set(roomName, new Set());
  }

  clientConnection.currentRoom = roomName;
  roomMap.get(roomName).add(clientConnection);

  const roomAction = isCreatingRoom ? "created and joined" : "joined";
  console.log(`${clientConnection.username} ${roomAction} room "${roomName}"`);
}

function broadcastMessageToRoom(clientConnection, messageText) {
  const currentRoom = clientConnection.currentRoom;
  if (!currentRoom || !roomMap.has(currentRoom)) return;

  const chatMessagePayload = {
    type: "chat",
    username: clientConnection.username,
    message: messageText,
  };

  const connectedClientsInRoom = roomMap.get(currentRoom);
  for (const roomClient of connectedClientsInRoom) {
    if (roomClient.readyState === WebSocket.OPEN) {
      roomClient.send(JSON.stringify(chatMessagePayload));
    }
  }
}

function removeClientFromCurrentRoom(clientConnection) {
  const currentRoom = clientConnection.currentRoom;
  if (currentRoom && roomMap.has(currentRoom)) {
    roomMap.get(currentRoom).delete(clientConnection);
  }
  clientConnection.currentRoom = null;
}

httpServer.listen(SERVER_PORT, () => {
  console.log(`WebSocket server is running at http://localhost:${SERVER_PORT}`);
});
