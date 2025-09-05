import axios from 'axios';

import { JWT_HOST_API } from 'configs/auth.config';

const axiosInstance = axios.create({
  baseURL: `${JWT_HOST_API}/api`,
});

const authToken = window.localStorage.getItem("authToken");
if (authToken) {
  const decodedToken = new TextDecoder("utf-8").decode(Uint8Array.from(atob(authToken), c => c.charCodeAt(0)));
  axiosInstance.defaults.headers['Authorization'] = `token ${decodedToken}`
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;