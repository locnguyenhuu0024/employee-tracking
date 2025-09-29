const { where } = require("firebase/firestore");
const { addOrUpdate, get } = require("./firebaseService");

const receiveMessage = (socket) => {
  socket.on('message', async (data) => {
    await addOrUpdate('messages', data, null);

    const user = await get("users", data.to);

    const query = [where("chatId", "==", data.chatId)];
    const chats = await get("chats", null, query);
    let chat = chats[0] || null;

    if (!chat) {
      const newChat = {
        title: user.firstName + " " + user.lastName,
        chatId: data.chatId,
        lastMessage: data.content,
        group: data.chatId.split('-'),
        createdAt: new Date().toISOString(),
      }
      await addOrUpdate('chats', newChat, null);
    }else{
      chat.lastMessage = data.content;
      await addOrUpdate('chats', chat, chat.id);
    }
    
    console.log("Send message to", data.to)
    socket.broadcast.emit(data.to, data);
  });
}

module.exports = { receiveMessage }
