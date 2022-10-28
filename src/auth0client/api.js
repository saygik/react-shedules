// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

axios.defaults.timeout = 30000;

const apiData = async (url, token = '', method = 'get', data = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  return axios({
    method,
    url: url,
    headers,
    data
  });
};

export async function apiCall({
  url,
  method,
  token
}) {
  return await apiData(url, token, method);
}

