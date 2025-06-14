import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import assignUsername from "./modules/assignUsername.ts";
import joinRoom from "./modules/join_room.ts";
import removeClientFromCurrentRoom from "./modules/removeClientFromCurrentRoom.ts";
import broadcastMessageToRoom from "./modules/broadcastMessageToRoom.ts";
import checkMessage from "./modules/checkMessage.ts";
import getClient from "./modules/getClientFromRoom.ts";

import { roomMap } from "./room.ts";
import assignArtist from "./modules/assignArtist.ts";
import startGame from "./modules/startGame.ts";

const expressApplication = express();
const httpServer = http.createServer(expressApplication);
const SERVER_PORT = 3000;

const webSocketServer = new WebSocketServer({ server: httpServer });

expressApplication.use(cors());
expressApplication.use(express.json());

expressApplication.get("/", (request, response) => {
  response.send("WebSocket chat server is running");
});

webSocketServer.on("connection", (clientConnection) => {
  clientConnection.username = null;
  clientConnection.currentRoom = null;
  clientConnection.isArtiest = false;

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
        const guessedWord = checkMessage(parsedData.message);
        if (!clientConnection.hasGuessedWord) {
          broadcastMessageToRoom(
            clientConnection,
            parsedData.message,
            guessedWord
          );
        }
        if (guessedWord && !clientConnection.hasGuessedWord) {
          clientConnection.hasGuessedWord = true;
        }
        break;

      case "get_clients":
        getClient(clientConnection);
        break;

      case "request_start":
        startGame(clientConnection);
        break;
      case "draw":
        if (clientConnection.currentRoom) {
          const roomClients = roomMap.get(clientConnection.currentRoom);
          for (const client of roomClients) {
            console.log(parsedData);
            if (
              client !== clientConnection &&
              client.readyState === WebSocket.OPEN
            ) {
              client.send(
                JSON.stringify({
                  type: "draw",
                  x0: parsedData.x0,
                  y0: parsedData.y0,
                  x1: parsedData.x1,
                  y1: parsedData.y1,
                  color: parsedData.color,
                  size: parsedData.size,
                })
              );
            }
          }
        }
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

httpServer.listen(SERVER_PORT, () => {
  console.log(`WebSocket server is running at http://localhost:${SERVER_PORT}`);
});
