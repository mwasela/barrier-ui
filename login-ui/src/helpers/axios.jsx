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

//interceptor to catch 401 and 403 responses and navigate to /login

instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if(error.response.status === 401 || error.response.status === 403){
        window.location = '/login';
    }
    return Promise.reject(error);
});



export default instance



