const assignUsername = (clientConnection, data) => {
  clientConnection.username = data.username;
  console.log(`Username assigned: ${clientConnection.username}`);
};

export default assignUsername;
