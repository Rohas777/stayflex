import axios from "axios";

export const instance = axios.create({
    withCredentials: false, //NOTE - Разобратья
    // baseURL: "http://127.0.0.1:8000/",
    baseURL: "https://aa76-85-91-197-195.ngrok-free.app/",
});
