import { roomMap } from "../room.ts";

const assignArtist = (clientConnection) => {
  const currentRoom = clientConnection.currentRoom;

  const clientsInRoom = roomMap.get(currentRoom);

  console.log(clientsInRoom);
};

export default assignArtist;
