import { roomMap } from "../room.ts";

const removeClientFromCurrentRoom = (clientConnection) => {
  const currentRoom = clientConnection.currentRoom;
  if (currentRoom && roomMap.has(currentRoom)) {
    roomMap.get(currentRoom).delete(clientConnection);
  }
  clientConnection.currentRoom = null;
};

export default removeClientFromCurrentRoom;
