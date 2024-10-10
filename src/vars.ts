import axios from "axios";

export const instance = axios.create({
    withCredentials: true,
    // baseURL: "http://127.0.0.1:8000/",
    baseURL: "https://8831-88-135-114-202.ngrok-free.app/",
});
