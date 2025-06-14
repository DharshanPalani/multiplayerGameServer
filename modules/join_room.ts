import removeClientFromCurrentRoom from "./removeClientFromCurrentRoom.ts";
import { roomMap } from "../room.ts";

const joinRoom = (clientConnection, roomName, isCreatingRoom = false) => {
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
};

export default joinRoom;
