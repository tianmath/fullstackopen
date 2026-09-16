import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newblog) => {
  const config = {
    headers: { Authorization: token },
  };

  const res = await axios.post(baseUrl, newblog, config);

  return res.data;
};

export default { getAll, create, setToken };
