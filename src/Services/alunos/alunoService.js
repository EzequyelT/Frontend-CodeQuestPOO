import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users';

export const registerUser = async (data) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};
