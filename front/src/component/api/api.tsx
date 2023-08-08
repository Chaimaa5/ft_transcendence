import axios from "axios"
import { useEffect } from "react"

const Instanse = axios.create(
    {
        baseURL: "http://localhost:3000/api",
        withCredentials: true,
    }
)

Instanse.interceptors.response.use(
    (response)=>{
        return response
    },
    (error) => {
        if(error.response.data.message == "Unauthorized")
            Instanse.get("/api/refresh")
    }
)
export default Instanse