import axios from "axios";

const instance = (token) => axios.create({
  baseURL: import.meta.env.VITE_BE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});

export const updateOwner = async (id, values) => {
  const token = localStorage.getItem('accessToken');
  const response = await instance(token).put(`/api/owners/${id}`, values);
  return response.data;
};

export const getOwnerById = async (id) => {
  const token = localStorage.getItem('accessToken');
  const response = await instance(token).get(`/api/owners/${id}`);
  return response.data;
}
