const messageList = ["Rizz", "Skibidi", "Ohio", "Sigma"];

const checkMessage = (message: string): boolean => {
  const found = messageList.some((keyWord) => {
    if (keyWord === message) {
      console.log("Guessed the word");
      return true;
    }
    return false;
  });

  return found;
};

export default checkMessage;
