import { Spin } from "antd";
import React, { useEffect } from "react";

export const RoomNotFound = ({gameId}) => {

	return(
        <div className="h-[100%] w-[100%] flex justify-center items-center ">
            <h1 className="text-LightBlue text-[4vw] ">
            <span className="text-[5vw] text-Red">!</span>
            <br/>Room id : {gameId} Not Found</h1>
        </div>
	)
}