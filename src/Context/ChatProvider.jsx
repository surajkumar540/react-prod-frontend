import { createContext, useContext, useEffect, useState } from "react"
import { useLocation } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem("userInfo"));
    const [selectChatV1, setSelectedChatV1] = useState([]);
    const [currentChats, setCurrentChats] = useState([]);
    const [chats, setChats] = useState([]);
    const location = useLocation();
    const [serviceType, setSeviceType] = useState();
    const [compNameContext,setCompNameContext]=useState("")


    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        setUser(userInfo);
        if (!userInfo) {
            if (location.pathname !== "login") {
                localStorage.clear();
                window.location.href = "/login";
            }
        }
    }, [location])

    return (
        <ChatContext.Provider value={{ user, setUser, selectChatV1, setSelectedChatV1, currentChats, setCurrentChats, chats, setChats,setCompNameContext,compNameContext }}>
            {children}
        </ChatContext.Provider>

    )
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;