import axios from 'axios';
import { getAuth } from 'firebase/auth';
import React from 'react';

const axiosSecure = axios.create({
  baseURL: 'https://localhost:3000',
});

axiosSecure.interceptors.request.use(async config => {
  const token = await getAuth().currentUser?.getIdToken();
  config.headers.authorization = `Bearer ${token}`;
  return config;
});

const useAxiosSecure = () => {
   return axiosSecure;
};

export default useAxiosSecure;