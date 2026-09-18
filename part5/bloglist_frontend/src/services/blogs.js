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

const update = async (id, newBlogValues) => {
  const res = await axios.put(`${baseUrl}/${id}`, newBlogValues);

  return res.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  return await axios.delete(`${baseUrl}/${id}`, config);
};

export default { getAll, create, update, remove, setToken };
