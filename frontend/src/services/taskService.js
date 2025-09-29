import axios from 'axios';

const instance = (token) => axios.create({
  baseURL: import.meta.env.VITE_BE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});

const getTasks = async () => {
  const token = localStorage.getItem('accessToken');
  const res = await instance(token).get(`/api/tasks`);
  return res.data;
};

const addTask = async (data) => {
  const token = localStorage.getItem('accessToken');
  const res = await instance(token).post(`/api/tasks`, data);
  return res.data;
};

const updateTask = async (id, data) => {
  const token = localStorage.getItem('accessToken');
  const res = await instance(token).put(`/api/tasks/${id}`, data);
  return res.data;
};

const deleteTask = async (id) => {
  const token = localStorage.getItem('accessToken');
  const res = await instance(token).delete(`/api/tasks/${id}`);
  return res.data;
};

export { getTasks, addTask, updateTask, deleteTask };