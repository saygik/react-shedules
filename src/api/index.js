// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

axios.defaults.timeout = 30000;

// eslint-disable-next-line no-underscore-dangle
//const _apiBase = 'http://userinfoapi.brnv.rw';
// eslint-disable-next-line no-underscore-dangle
//const _apiBase = 'http://10.2.35.95:9099';
const _apiBase = process.env.REACT_APP_API;

const index = {};
const apiData = async (url, token = '', method = 'get', data = {}) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    return axios({
        method,
        url: _apiBase + url,
        headers,
        data
    });
};

// eslint-disable-next-line no-return-await
index.getDomains = async () => await apiData('/v1/users/domains', '', 'get');
// eslint-disable-next-line no-return-await
index.getAuth = async (email, password) => await apiData('/v1/login', '', 'post', JSON.stringify({ email, password }));
// eslint-disable-next-line no-return-await
index.findUser = async (token) => await apiData('/v1/users/whoami', token, 'get');
// eslint-disable-next-line no-return-await
index.getAdUser = async (domain) => await apiData(`/v1/users/ad/${domain}`, '', 'get');
// eslint-disable-next-line no-return-await
index.getAdUserInGroup = async (domain, group) => await apiData(`/v1/users/ad/${domain}/${group}`, '', 'get');
// eslint-disable-next-line no-return-await
index.getOneUser = async (userPN) => await apiData(`/v1/user/ad/${userPN}`, '', 'get');
// eslint-disable-next-line no-return-await
index.addTask = async (idc,title,upn,start, end) => await apiData('/v1/schedule', '', 'post', JSON.stringify({ idc,title,upn,start, end }));
// eslint-disable-next-line no-return-await
index.getSchedules = async (idc) => await apiData(`/v1/schedule/${idc}`, '', 'get');
// eslint-disable-next-line no-return-await
index.updateTask = async (id,start,end) => await apiData(`/v1/schedule/${id}`, '', 'put', JSON.stringify({ start, end }));
// eslint-disable-next-line no-return-await
index.deleteTask = async (id) => await apiData(`/v1/schedule/${id}`, '', 'delete');

export default index;

