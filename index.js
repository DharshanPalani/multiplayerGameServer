import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import assignUsername from "./assignUsername.js";
import joinRoom from "./join_room.js";
import removeClientFromCurrentRoom from "./removeClientFromCurrentRoom.js";
import broadcastMessageToRoom from "./broadcastMessageToRoom.js";

const expressApplication = express();
const httpServer = http.createServer(expressApplication);
const SERVER_PORT = 3000;

export const roomMap = new Map();
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
        joinRoom(clientConnection, parsedData.room, roomMap, true);
        break;

      case "join_room":
        joinRoom(clientConnection, parsedData.room, roomMap, false);
        break;

      case "chat":
        broadcastMessageToRoom(clientConnection, parsedData.message, roomMap);
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
    removeClientFromCurrentRoom(clientConnection, roomMap);
  });
});

httpServer.listen(SERVER_PORT, () => {
  console.log(`WebSocket server is running at http://localhost:${SERVER_PORT}`);
});
