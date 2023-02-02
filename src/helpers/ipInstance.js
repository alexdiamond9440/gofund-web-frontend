import axios from "axios";
export var instance = axios.create({
    baseURL: 'https://jsonip.com/'
});
instance.defaults.headers = ""