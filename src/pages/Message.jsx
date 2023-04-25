import React from 'react'
import LeftSideBar from '../components/LeftSideBar/LeftSideBar'
import MessageGrid from '../components/MessageGrid/MessageGrid'
const Message = () => {

    return (
        <>
            <LeftSideBar data={{ pageName: "Message", index: 1 }}>
               <MessageGrid  />
            </LeftSideBar>
        </>
    )
}

export default Message