import axios from "axios";
import { API_URL } from '../constants';

//create interceptors for all CRUD calls by axios
const instance = axios.create({
    baseURL: API_URL
});

instance.interceptors.request.use(function (config) {
    if(localStorage.getItem('token')){
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return config;
    }, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

export default instance



