import { roomMap } from "../room.ts";

const startGame = (clientConnection) => {
  const currentRoom = clientConnection.currentRoom;
  if (!currentRoom || !roomMap.has(currentRoom)) return;

  var clientArray: any = [];

  const connectedClientsInRoom = roomMap.get(currentRoom);
  for (const roomClient of connectedClientsInRoom) {
    if (roomClient.readyState === WebSocket.OPEN) {
      clientArray.push(roomClient);
      const startGameMessage = {
        type: "start_game",
      };
      roomClient.send(JSON.stringify(startGameMessage));
    }
  }

  if (clientArray.length === 0) return;

  const randomIndex = Math.floor(Math.random() * clientArray.length);
  const chosenClient = clientArray[randomIndex];

  const assignArtistMessage = {
    type: "assign_artist",
    word: "Rizz",
  };

  console.log("Choosen artist is :" + chosenClient.username);

  chosenClient.send(JSON.stringify(assignArtistMessage));
};

export default startGame;
