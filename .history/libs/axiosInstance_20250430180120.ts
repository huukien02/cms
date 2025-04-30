import { TOKEN_ORG_USER } from '@/common/auth'
import axios from 'axios'
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_HOST_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const jwtToken = Cookies.get(TOKEN_ORG_USER);
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;