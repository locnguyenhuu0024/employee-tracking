import axios from 'axios';

const instance = (token) => axios.create({
  baseURL: import.meta.env.VITE_BE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});

const getEmployees = async () => {
  const token = localStorage.getItem('accessToken');
  const res = await instance(token).get(`/api/employees`);
  return res.data;
};

const getEmployeeById = async (id) => {
  const token = localStorage.getItem('accessToken');
  const res = await instance(token).get(`/api/employees/${id}`);
  return res.data;
}

const addEmployee = async (data) => {
  const token = localStorage.getItem('accessToken');
  const res = await instance(token).post(`/api/employees`, data);
  return res.data;
};

const updateEmployee = async (id, data) => {
  const token = localStorage.getItem('accessToken');
  const res = await instance(token).put(`/api/employees/${id}`, data);
  return res.data;
};

const deleteEmployee = async (id) => {
  const token = localStorage.getItem('accessToken');
  const res = await instance(token).delete(`/api/employees/${id}`);
  return res.data;
};

export { getEmployees, getEmployeeById, addEmployee, updateEmployee, deleteEmployee };