const { get } = require("../services/firebaseService");
const { where, orderBy } = require("firebase/firestore");

const getListChats = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const query = [where("group", "array-contains", userId), orderBy("createdAt", "desc")];
    const chats = await get("chats", null, query);
    res.status(200).json({ status: 'ok', message: 'Get list chats successfully', data: chats });
  } catch (error) {
    console.log('line 11', error);
    res.status(500).json({ status: 'error', message: 'Get list chats failed', details: error });
  }
}

const getMessages = async (req, res) => {
  try {
    const chat = await get("messages", null, [where("chatId", "==", req.params.chatId)]);
    res.status(200).json({ status: 'ok', message: 'Get chat successfully', data: chat });
  } catch (error) {
    console.log('line 21', error);
    res.status(500).json({ status: 'error', message: 'Get chat failed', details: error });
  }
}

module.exports = { getListChats, getMessages }
