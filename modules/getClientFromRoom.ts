import { roomMap } from "../room.ts";

const getClient = (clientConnection) => {
  const currentRoom = clientConnection.currentRoom;

  const clientsInRoom = roomMap.get(currentRoom);

  if (!clientsInRoom) {
    clientConnection.send(
      JSON.stringify({ type: "error", message: "Room does not exist" })
    );
    return;
  }

  const clientList = Array.from(clientsInRoom).map((client: any) => ({
    username: client.username || null,
    hasGuessedWord: client.hasGuessedWord || false,
  }));

  clientConnection.send(
    JSON.stringify({
      type: "client_list",
      room: currentRoom,
      clients: clientList,
    })
  );
};

export default getClient;
