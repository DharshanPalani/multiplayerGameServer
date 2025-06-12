import { roomMap } from "./index.js";

const broadcastMessageToRoom = (clientConnection, messageText, guessedWord) => {
  const currentRoom = clientConnection.currentRoom;
  if (!currentRoom || !roomMap.has(currentRoom)) return;

  const connectedClientsInRoom = roomMap.get(currentRoom);
  for (const roomClient of connectedClientsInRoom) {
    if (roomClient.readyState === WebSocket.OPEN) {
      if (guessedWord == true) {
        const announceMessagePayload = {
          type: "chat",
          username: "server",
          message: clientConnection.username + " has guessed the word",
        };
        roomClient.send(JSON.stringify(announceMessagePayload));
      } else {
        const chatMessagePayload = {
          type: "chat",
          username: clientConnection.username,
          message: messageText,
        };
        roomClient.send(JSON.stringify(chatMessagePayload));
      }
    }
  }
};

export default broadcastMessageToRoom;
