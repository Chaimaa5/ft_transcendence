import { Spin } from "antd";
import React, { useEffect } from "react";

export const Loading = () => {
	return(
		<div className="h-[40%]  w-[100%] flex items-end justify-center">
			<h3 className="text-[4vw] text-LightBlue "> Loading...</h3>
			<div className="flex h-[30%] w-[100%] items-center justify-center">
                    <Spin size="large" /> 
            </div>
		</div>
	)
}