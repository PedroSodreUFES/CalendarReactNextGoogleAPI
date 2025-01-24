import axios from "axios";

export const api = axios.create({
    baseURL: '/api'
    /* se fosse desconectado seria:
    
    baseURL: 'http://localhost:3333/api'
    
    */
})