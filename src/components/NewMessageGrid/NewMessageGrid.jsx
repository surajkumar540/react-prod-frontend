import { Box, Grid, Typography, Avatar, Stack, Button, Badge, TextField, AvatarGroup } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import ContentModels from "../../pages/ContentModels";
import { useLocation } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';
import { useMutation } from 'react-query';
import { fetchAllChatSingleUserOrGroup, fetchMessagesV1, sendV1Message }
    from "../../api/InternalApi/OurDevApi";
import { getSender } from "../../utils/chatLogic";
import { getTime } from '../../utils/validation';
import socket from "../../socket/socket";

import ListModal from '../Chat/ListModal';


var selectedChatCompare;
const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            content: '""',
        },
    },
}));

const NewMessageGrid = ({ selectedChannel }) => {

    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const contentRef = useRef(null);
    const [isTyping, setisTyping] = useState(false);
    const [typing, setTyping] = useState(false);
    ////// socket connection state
    const [socketConnected, setSocketConnected] = useState(false);
    ////// use conetext use here
    const { user, setUser, selectChatV1,
        setSelectedChatV1, currentChats, setCurrentChats,
        chats, setChats, notification, setNotification } = ChatState();
    //////////// Store the userid of user ////////
    const [UserId, setUserId] = useState("");
    useEffect(() => {
        setActiveChannel(selectedChannel);
    }, [selectedChannel])



    ///////// UseEffect for socket io
    useEffect(() => {
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setisTyping(true));
        socket.on("stop typing", () => setisTyping(false));
    }, []);





    /////////when user click on the channel/////////////
    //////// Here we are store the active channel //////
    const [ActiveChannel, setActiveChannel] = useState({});
    //////// All messges of channel  store here //////////////
    const [AllMessagesChannel, setAllMessgesOfChannel] = useState([]);
    const [messageInterval, setmessageInterval] = useState(null);


    const cssStyle = {
        firstBoxMessage: { height: "80vh", backgroundColor: "#ffffff", marginTop: "0px" },
        groupNameBox: {
            position: "sticky", top: "65px", width: "100%", height: "50px", zIndex: "100",
            background: "#ffffff", boxSizing: "border-box",
            borderBottom: "1px solid #F1F1F1"
        },
        avatarCss: { width: "25px", height: "25px" },
        listofPeopeBtn: { paddingLeft: "10px", paddingRight: "10px", fontSize: "10px" },
        timeRecMess: { fontSize: "10px", lineHeight: "25px", paddingLeft: "5px" },
        recRealMess: {
            paddingRight: "30px", paddingLeft: "10px", paddingTop: "10px", paddingBottom: "10px",
            fontSize: "14px", lineHeight: "15px", color: "black", background: "#F2F2F2", borderRadius: "0px 10px 10px 10px", fontWeight: '400'
        },
        sendRealMess: {
            paddingRight: "10px", paddingLeft: "10px", paddingTop: "10px", paddingBottom: "10px",
            fontSize: "14px", lineHeight: "15px", background: "#448DF0", color: "white", borderRadius: "10px 0px 10px 10px", fontWeight: "400"
        },
        sendMessInput: {
            "& input": {
                fontSize: "13px !important"
            },
            "& fieldset": {
                borderRadius: "50px",
            }
        },
        sendMessIcon: {
            position: "absolute", right: "5px", top: "4px", fontSize: "28px", backgroundColor: "#333333", borderRadius: "25px", padding: "5px", color: "#fff", cursor: "pointer"
        },
        messageBoxCon: {
            backgroundColor: "#ffffff",
            height: "75vh", width: "100%", position: "absolute", overflowY: "auto",
            '&::-webkit-scrollbar': {
                width: '0px',
            },
            '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
            },
        }
    }

    ///// Model Open function like create channel
    //////new model  open when click on the left side bar options and some others options like add folder and add teammate and so more
    const [openNewModel, setOpenNewModel] = useState(false);
    const [show, setShow] = useState(false);
    const [NewModelOpen, setNewModelOpen] = useState(false);
    const [activeModel, setActiveModel] = useState("")
    const modelOpens = () => {
        setOpenNewModel(true);/////this change the state in this page and then model show
        setShow(true);/////active model in diffrent page
        setActiveModel("AddTeamMate");/////// which type of model active
        setNewModelOpen(true);////// Real dilog box open
    }


    ////////////// When user type  the message then store the value here
    const [newMessage, setNewMessage] = useState("");
    ////////// login member data///////
    const [member, setMember] = useState({
        username: '',
        userId: '',
    });

    const setNewMessaageFun = (event) => {
        setNewMessage(event.target.value);

        /////// three dot show when typing start
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectChatV1._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectChatV1._id);
                setTyping(false);
                setisTyping(false);
            }
        }, timerLength)

    }



    ////////// send message in new version //////
    const { mutateAsync: sendingMessageV1 } = useMutation(sendV1Message);
    const sendMessagev1 = async (message) => {
        socket.emit("stop typing", selectChatV1._id)
        try {
            const sendingMessData = {
                content: message,
                chatId: selectChatV1._id
            }
            setNewMessage("");
            const response = await sendingMessageV1(sendingMessData);
            setCurrentChats([...currentChats, response])

            socket.emit("new message", response);
            socket.emit("add-notification-in-member",{response})

        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        socket.on("message recived", (newMessageRecived) => {
            if (!selectedChatCompare || (selectedChatCompare._id !== newMessageRecived.chat._id)) {
                if (!notification.includes(newMessageRecived)) {
                    setNotification([...notification, newMessageRecived]);
                }
            } else {
                console.log("send message and recove message test", [...currentChats, newMessageRecived]);
                setCurrentChats([...currentChats, newMessageRecived]);

            }
        })
    })


    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (newMessage !== "") {
                sendMessagev1(newMessage);
            }

        }
    };

    const clickSendMessButton = () => {
        if (newMessage !== "") {
            sendMessagev1(newMessage);
        }
    }


    /////////////// fetch message of chats in  new version /////////////
    const { mutateAsync: fetchingAllMess } = useMutation(fetchMessagesV1);
    const fetchAllMessV1 = async (chatId) => {
        try {
            const response = await fetchingAllMess({ chatId });
            setCurrentChats(response)
            socket.emit("join chat", chatId)
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        if (AllMessagesChannel.length !== 0) {
            console.log(AllMessagesChannel);
        }
    }, [AllMessagesChannel])


    /////////////////////// Here we are create new state for new Version  Apis ////////////////
    const [MyActiveChat, setMyActiveChat] = useState({});

    useEffect(() => {
        if (selectChatV1?._id) {
            setMyActiveChat(selectChatV1)
            setCurrentChats([]);
            fetchAllMessV1(selectChatV1._id)
            selectedChatCompare = selectChatV1;
        }
    }, [selectChatV1._id])

    /////// sccrollbard automatic movein bottom place
    useEffect(() => {
        const contentElement = contentRef.current;
        if (contentElement) {
            contentElement.scrollTop = contentElement.scrollHeight;
        }

    }, [currentChats])






    return (
        <>
            <Box container px={"25px"} boxSizing={"border-box"} sx={cssStyle.groupNameBox} display="flex" justifyContent={"space-between"} alignItems={'center'}>
                {
                    <>
                        <Box display={"flex"} height='30px'>
                            {
                                selectChatV1?.isGroupChat === false &&
                                <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">

                                    <Avatar alt="Remy Sharp" src="" sx={{ width: 30, height: 30 }}  >{selectChatV1?.users[1].name[0].toUpperCase()}</Avatar>
                                </StyledBadge>
                            }
                            <Box display='flex' flexDirection='column' justifyContent={'center'}>
                                <Box>

                                <Typography fontWeight={"600"}
                                    variant="subtitle2" paddingTop={0.3} paddingLeft={1.2} textTransform={'capitalize'} >
                                    {/* {ActiveChannel.Name.charAt(0).toUpperCase() + ActiveChannel.Name.slice(1)} */}
                                    {Object.keys(MyActiveChat).length > 0 &&
                                        (!MyActiveChat.isGroupChat ? getSender(user, MyActiveChat?.users) : (MyActiveChat.chatName))
                                    }
                                     {
                                        
                                        selectChatV1?.isGroupChat === false &&
                                        <Typography fontSize='12px'>
                                            online
                                        </Typography>
                                        }
                                    
                                </Typography>
                               

                                </Box>
                            </Box>

                            <Stack ml={1} direction="row" spacing={-.25}>
                                <AvatarGroup max={3}
                                    sx={{
                                        '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 15 },
                                    }}
                                >
                                    {
                                        selectChatV1?.isGroupChat === true &&
                                        selectChatV1?.users?.map((item) => {
                                            return <Avatar alt="Remy Sharp" src={item?.pic}>{item.name[0].toUpperCase()}</Avatar>
                                        })
                                    }

                                </AvatarGroup>
                            </Stack>
                        </Box>


                        {
                            (selectChatV1?.isGroupChat === 'true' || selectChatV1?.isGroupChat === true) && <Box display={'flex'} alignItems={'center'} >

                                {selectChatV1?.groupAdmin._id === localStorage.getItem("userInfo") && <Button
                                    sx={{ ...cssStyle.listofPeopeBtn, marginRight: "10px" }}
                                    variant="outlined"
                                    size="small"
                                    onClick={() => modelOpens()}>
                                    Add Member
                                </Button>}
                                <ListModal buttonStyle={cssStyle.listofPeopeBtn} addMemberFunction={modelOpens} />
                            </Box>
                        }
                    </>
                }

            </Box>
            <Box container position={'relative'} id="NewMessageBox" sx={cssStyle.firstBoxMessage}>
                <Box
                    container
                    position={'absolute'}
                    sx={cssStyle.messageBoxCon}
                    pt={"40px"}
                    pb={"30px"}
                    mt={"0px"}
                    px={"20px"}
                    ref={contentRef}
                >
                    {
                        /* 
                        {AllMessagesChannel.length !== 0 &&
                            AllMessagesChannel.map((mes) => {
                                if (mes.Sender.Name !== member.username) {
                                    return <Grid id="rec_mess_con_grid" sx={{
                                        marginTop: "0px", width: "100%", marginLeft: "0px",
                                        boxSizing: "borderBox",
                                    }} container spacing={5}>
                                        <Grid id="reciver_mess_grid" sx={{ paddingTop: "10px !important", paddingLeft: "0px !important" }} item xs={12} md={6}>
                                            <Box container display={'flex'} mb={1} py={0.5}>
                                                <Box id="mess_user_pic_box">
                                                    <Stack ml={1} direction="row">
                                                        <Avatar
                                                            sx={{ ...cssStyle.avatarCss, width: "30px", height: "30px" }}
                                                            alt="Remy Sharp"
                                                            src="https://mui.com/static/images/avatar/1.jpg" />
                                                    </Stack>
                                                </Box>
                                                <Box ml={1}>
                                                    <Grid container>
                                                        <Grid container item>
                                                            <Typography variant="subtitle2" fontWeight={"700"} textTransform={'capitalize'}>
                                                                {mes.Sender.Name}
                                                            </Typography>
                                                            <Typography variant="body2" sx={cssStyle.timeRecMess} >10:30 AM</Typography>
                                                        </Grid>
                                                        <Grid container item boxSizing={"border-box"} mr="16px" >
                                                            <Typography variant="body2" sx={cssStyle.recRealMess} >
                                                                {mes.Content}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid id="empty_reciver_mess_grid" item display={{ xs: "none", md: "block" }} xs={12} md={6}>
                                        </Grid>
                                    </Grid>
                                } else {
                                    return <Grid id="send_mess_con_grid" container spacing={5}>
                                        <Grid item id="empty_sender_mess_grid" display={{ xs: "none", md: "block" }} xs={12} md={6}>
                                        </Grid>
                                        <Grid item id="sender_mess_grid" xs={12} md={6}>
                                            <Box container display={'flex'} flexDirection="row-reverse" mb={1} py={0.5}>
                                                <Box id="mess_user_pic_box_send">
                                                    <Stack ml={1} direction="row">
                                                        <Avatar sx={{ ...cssStyle.avatarCss, width: "30px", height: "30px" }} alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                                                    </Stack>
                                                </Box>
                                                <Box ml={1}>
                                                    <Grid container>
                                                        <Grid container item display={"flex"} justifyContent="flex-end">
                                                            <Typography variant="subtitle2" fontWeight={"700"} textTransform={'capitalize'}>
                                                                {mes.Sender.Name}
                                                            </Typography>
                                                            <Typography variant="body2" sx={cssStyle.timeRecMess} >10:30 AM</Typography>
                                                        </Grid>
                                                        <Grid container item boxSizing={"border-box"} mr="16px" display={"flex"} justifyContent="end">
                                                            <Typography variant="body2" sx={{ ...cssStyle.sendRealMess, width: "auto", textAlign: "right" }} >
                                                                {mes.Content}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                }
                            })} 
                            
                            */
                    }

                    {(currentChats.length > 0 && selectChatV1) &&
                        <>
                            {currentChats?.map((mes, index) => {
                               
                                if (mes?.sender?._id !== localStorage.getItem("userInfo")) {
                                    return <Grid
                                        id="rec_mess_con_grid"
                                        sx={{
                                            marginTop: "0px", width: "100%", marginLeft: "0px",
                                            boxSizing: "borderBox"
                                        }}
                                        container
                                        spacing={5}
                                        key={`message_left_revicer_${index}`}
                                    >
                                        <Grid id="reciver_mess_grid"
                                            sx={{ paddingTop: "10px !important", paddingLeft: "0px !important" }}
                                            item xs={12} md={6}
                                        >
                                            <Box container display={'flex'} mb={1} py={0.5}>
                                                <Box id="mess_user_pic_box">
                                                    <Stack ml={1} direction="row">
                                                        <Avatar
                                                            sx={{ ...cssStyle.avatarCss, width: "30px", height: "30px" }}
                                                            alt="Remy Sharp"
                                                            src="https://mui.com/static/images/avatar/1.jpg" />
                                                    </Stack>
                                                </Box>
                                                <Box ml={1}>
                                                    <Grid container>
                                                        <Grid container item>
                                                            <Typography variant="subtitle2" fontWeight={"700"} textTransform={'capitalize'}>
                                                                {mes.sender.name}
                                                            </Typography>
                                                            <Typography variant="body2" sx={cssStyle.timeRecMess} >{getTime(mes?.createdAt)}</Typography>
                                                        </Grid>
                                                        <Grid container item boxSizing={"border-box"} mr="16px" >
                                                            <Typography variant="body2" sx={cssStyle.recRealMess} >
                                                                {mes.content}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid id="empty_reciver_mess_grid" item display={{ xs: "none", md: "block" }} xs={12} md={6}>
                                        </Grid>
                                    </Grid>
                                } else {
                                    return <Grid
                                        id="send_mess_con_grid"
                                        container
                                        spacing={5}
                                        key={`mess_sender_${index}`}

                                    >
                                        <Grid item id="empty_sender_mess_grid" display={{ xs: "none", md: "block" }} xs={12} md={6}>
                                        </Grid>
                                        <Grid item id="sender_mess_grid" xs={12} md={6}>
                                            <Box container display={'flex'} flexDirection="row-reverse" mb={1} py={0.5}>
                                                <Box id="mess_user_pic_box_send">
                                                    <Stack ml={1} direction="row">
                                                        <Avatar sx={{ ...cssStyle.avatarCss, width: "30px", height: "30px" }} alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                                                    </Stack>
                                                </Box>
                                                <Box ml={1}>
                                                    <Grid container>
                                                        <Grid container item display={"flex"} justifyContent="flex-end">
                                                            <Typography variant="subtitle2" fontWeight={"700"} textTransform={'capitalize'}>
                                                                {mes.sender.name}
                                                            </Typography>
                                                            <Typography variant="body2" sx={cssStyle.timeRecMess}>{getTime(mes?.createdAt)}</Typography>
                                                        </Grid>
                                                        <Grid container item boxSizing={"border-box"} mr="16px" display={"flex"} justifyContent="end">
                                                            <Typography variant="body2" sx={{ ...cssStyle.sendRealMess, width: "auto", textAlign: "right" }} >
                                                                {mes.content}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                }
                            })}
                        </>}

                </Box>
                <Box position={'absolute'} sx={{ width: "100%", bottom: "3%", backgroundColor: "#ffffff" }} py={"10px"} container px={"25px"}>
                    {isTyping ? <Box sx={{ fontSize: "15px", marginLeft: "10px" }}>Typing...</Box> : <Box></Box>}
                    <Box container
                        sx={{
                            width: '100%',
                            position: 'relative'
                        }}
                    >
                        <TextField
                            size='small'
                            sx={{ ...cssStyle.sendMessInput, position: "absolute" }}
                            fullWidth
                            placeholder='Type a message'
                            id="messageInput"
                            value={newMessage}
                            onChange={(e) => setNewMessaageFun(e)}
                            onKeyPress={handleEnterKeyPress}

                        />
                        <AttachFileIcon sx={{ ...cssStyle.sendMessIcon, right: "35px", backgroundColor: "#fff", color: "#333" }} />
                        <SendIcon onClick={() => clickSendMessButton()} sx={cssStyle.sendMessIcon} />
                    </Box>
                </Box>
            </Box>

            {openNewModel &&
                <ContentModels
                    activeModel={activeModel} //////  which type of model
                    show={show} //// boolen value of avtive  state model
                    NewModelOpen={NewModelOpen} ///// boolean value of dialog box open
                    setOpenNewModel={setOpenNewModel}
                    setShow={setShow}
                    setActiveModel={setActiveModel}
                    setNewModelOpen={setNewModelOpen}
                    ActiveChannel={ActiveChannel}
                    socket={socket}
                />
            }

        </>

    )
}

export default NewMessageGrid