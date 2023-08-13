import axios from "axios"
import { useEffect } from "react"
import sk from "socket.io-client"

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
            Instanse.get("/refresh")
    }
)

class skt {
    setToken(token_:string){
        this.token = token_;
    }
    token:string;
}

export const socket_ =  async  (endpoint: string) => {
    const Skt = new skt
    await Instanse.get("/access")
                  .then((res) => {Skt.setToken(res.data)});
    const socket =  sk(`http://localhost:3000/${endpoint}`, {
        extraHeaders: {
            Authorization: `Bearer ${Skt.token}`
        }
    });
    socket.on("disconnect", (reason: string) => {
      console.log("WebSocket disconnected:", reason);
    });
    return socket;
};

export default Instanse