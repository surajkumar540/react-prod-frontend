import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useLocation } from "react-router-dom";
import socket from "../socket/socket";
import { useMutation } from "react-query";
import { fetchAllChatSingleUserOrGroup } from "../api/InternalApi/OurDevApi";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem("userInfo"));
    const [selectChatV1, setSelectedChatV1] = useState([]);
    const [currentChats, setCurrentChats] = useState([]);
    const [chats, setChats] = useState([]);
    const location = useLocation();
    const [serviceType, setSeviceType] = useState();
    const [compNameContext, setCompNameContext] = useState("")
    const [notification, setNotification] = useState([]);

    const [pageNameContext,setPageNameContext]=useState("data");
    const [closeSideListContext,setCloseSideList]=useState(false)
    const [messagingActive, setMessagingActive] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState({});
    const [closeAppDrawer,setCloseAppDrawer]=useState(false)

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

    /////// get the chat of selected group or selected member v1
    const { mutateAsync: userGroupFetchChat } = useMutation(fetchAllChatSingleUserOrGroup);
    const fetchChat = async () => {
        try {
            const response = await userGroupFetchChat();
            if (response) {
                setChats(response);
                // setLoggedUser(localStorage.getItem("userInfo"));
            }
        } catch (error) {
            console.log("NewMessageGrid", error.response);
        }
    }
    useEffect(() => {
        socket.on("add-member-in-group-event", (recivedData) => {
            fetchChat();
        })
        socket.on("remove-member-in-group-event", (response) => {
            const RemoveChatId = response._id;
            const ChatsData = [...chats];
            const newChatData = ChatsData.filter((d) => d._id !== RemoveChatId);
            setChats(newChatData);
        })
        socket.on("show-notification-count-in-member",(response)=>{
            console.log({chats , response});
        })
    }, [chats])

    return (
        <ChatContext.Provider value={{
            user,
            setUser,
            selectChatV1,
            setSelectedChatV1,
            currentChats,
            setCurrentChats,
            chats,
            setChats,
            setCompNameContext,
            compNameContext,
            notification,
            setNotification,
            pageNameContext,
            setPageNameContext,
            closeSideListContext,
            setCloseSideList,
            messagingActive,
            setMessagingActive,
            selectedChannel,
            setSelectedChannel,
            setCloseAppDrawer,
            closeAppDrawer
        }}>
            {children}
        </ChatContext.Provider>

    )
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;