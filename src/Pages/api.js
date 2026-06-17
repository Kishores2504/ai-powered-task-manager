import axios from "axios";

const api = axios.create({
    baseURL : "http://localhost:8080"   
})

// the use method takes two parameters -> which is success handler , error handler
api.interceptors.response.use(
    response => {
        return response;
    } ,
    error => {
        if(error.response?.status === 401){
            localStorage.removeItem("ai_application_usertoken");
            window.location.href="/";
        }
        return Promise.reject(error);
    }
);
export default api