import axios from 'axios';

const instance = (token) => axios.create({
  baseURL: import.meta.env.VITE_BE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});

export const getListChats = async () => {
  const token = localStorage.getItem('accessToken');
  const res = await instance(token).get(`/api/chats`);
  return res.data;
};

export const getMessages = async (chatId) => {
  const token = localStorage.getItem('accessToken');
  const res = await instance(token).get(`/api/chats/${chatId}`);
  return res.data;
};
  