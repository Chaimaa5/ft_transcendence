import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../avatar";
import { ReactSVG } from "react-svg";
import Instanse from "../api/api";
import SearchIcon from "../tools/Search.svg"




type search_ = {
    username: string,
    avatar: string
}

const Search = () => {
    const [txt, settxt] = useState(true)
    const [input, setValue] = useState("");
    const [status, setStatus] = useState(0);
    const [response, setResponse] = useState<search_[]>([])
    useEffect(
        () => {
            if(input){
                Instanse.post('/home/search', {input})
                .then((res) => {
                    setResponse(res.data)
                });
            } else setResponse([]) 
        },[input]
    )
    return(
        <>
            <input onClick={() => settxt(false)}  className="search-box m-[2.5%] w-[20%] h-[35%]" 
                type="text"
                value={input}
                placeholder="Search..."
                onChange={(event) => {
                    setValue(event.target.value);
                }}
             />
            <ReactSVG className="search-icon mr-[10%] w-[1vw]" src={SearchIcon}/>
            {
                response[0] && input.length != 0 &&
                <div className="search-list rounded-[1vw] absolute h-[12vw] z-[1000] w-[17%] top-[80%] left-[4%]">
                    {
                        response.map((value, key)=> {
                            return(
                                <div key={key} className="flex m-[2%] h-[2.5vw] w-[95%] justify-evenly rounded-[2vw] items-center border-[0.1vw] border-[#F1FAEE]">
                                    <Link to={"/profile/" + value.username}>
                                        <Avatar src={value.avatar} wd_="2vw"/>
                                    </Link>
                                    <h4 className="name">{value.username}</h4>
                                </div>
                            )
                        }
                    )}
                </div>
            }
        </>
    )
}

export default Search;