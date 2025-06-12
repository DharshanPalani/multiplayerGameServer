import removeClientFromCurrentRoom from "./removeClientFromCurrentRoom.js";
import { roomMap } from "./index.js";

const joinRoom = (clientConnection, roomName, isCreatingRoom = false) => {
  if (!roomName) return;

  removeClientFromCurrentRoom(clientConnection, roomMap);

  if (!roomMap.has(roomName)) {
    if (!isCreatingRoom) return;
    roomMap.set(roomName, new Set());
  }

  clientConnection.currentRoom = roomName;
  roomMap.get(roomName).add(clientConnection);

  const roomAction = isCreatingRoom ? "created and joined" : "joined";
  console.log(`${clientConnection.username} ${roomAction} room "${roomName}"`);
};

export default joinRoom;
