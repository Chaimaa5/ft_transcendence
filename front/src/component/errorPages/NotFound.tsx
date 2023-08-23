import React from 'react'
import { ReactSVG } from 'react-svg'
import icon from '../tools/errorPage/error404.svg'

export const NotFound = () => {
  return (
    <div className={'absolute w-[100%] h-[100%] top-0 bottom-0 left-0 right-0 flex justify-center items-center'}>
        <ReactSVG src={icon} className="w-[25vw]"/>
    </div>
  )
}