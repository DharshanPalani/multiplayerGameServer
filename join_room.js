const joinRoom = (clientSocket, rooms, roomName) => {
  if (clientSocket.room && rooms.has(clientSocket.room)) {
    rooms.get(clientSocket.room).delete(clientSocket);
  }

  clientSocket.room = roomName;

  if (!rooms.has(roomName)) {
    rooms.set(roomName, new Set());
  }

  rooms.get(roomName).add(clientSocket);
};

export default joinRoom;
