import { createContext } from "react"
import React from "react"

type cntx = {
    username: string,
    avatar: string,
}
const test:cntx = {username: "", avatar: ""};
const CrContext = createContext<cntx>(test)
export default CrContext