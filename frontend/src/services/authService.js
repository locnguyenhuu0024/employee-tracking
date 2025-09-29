import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BE_BASE_URL,
});

const ownerSendCode = async (data) => {
  const response = await instance.post(`/api/auth/owner/sendcode`, data);
  return response.data;
};

const ownerVerifyCode = async (data) => {
  const response = await instance.post(`/api/auth/owner/verifycode`, data);
  return response.data;
};

const employeeSetup = async (data, token) => {
  const response = await axios.post(`${import.meta.env.VITE_BE_BASE_URL}/api/auth/employee/setup`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const employeeSignIn = async (data) => {
  const response = await instance.post(`/api/auth/employee/signin`, data);
  return response.data;
};

export { ownerSendCode, ownerVerifyCode, employeeSetup, employeeSignIn };