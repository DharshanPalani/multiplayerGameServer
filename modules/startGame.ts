import { roomMap } from "../room.ts";

const startGame = (clientConnection) => {
  const currentRoom = clientConnection.currentRoom;
  if (!currentRoom || !roomMap.has(currentRoom)) return;

  const connectedClientsInRoom = roomMap.get(currentRoom);
  for (const roomClient of connectedClientsInRoom) {
    if (roomClient.readyState === WebSocket.OPEN) {
      const startGameMessage = {
        type: "start_game",
      };
      roomClient.send(JSON.stringify(startGameMessage));
    }
  }
};

export default startGame;
