import React, { useEffect, useState } from 'react'
import { Grid, Typography, Box, TextField, Avatar } from '@mui/material'
import appConfig from "../../Config";
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InputBase from '@mui/material/InputBase';
import NavigationIcon from '@mui/icons-material/Navigation';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ModelAddMemberInChannel from "../ModelAddMemberInChannel/ModelAddMemberInChannel";

const MessageGrid = () => {

    ////////// login member data///////
    const [member, setMember] = useState({
        username: '',
        userId: '',
    });
    const [searchUser, setSearchUser] = useState("");
    //////// Here we are store user_id  ////////
    const [user_id, setUserID] = useState("");
    //////// Here we are store a channel name list //////
    const [channelList, setChannelList] = useState([]);
    //////// Here we are store the active channel //////
    const [ActiveChannel, setActiveChannel] = useState({});
    //////// Add member model Open ////////
    const [AddMemberModel, setMemberModel] = useState(false);
    //////// All users list store here //////
    const [AddAllUsers, SetAllUsersList] = useState([]);
    //////// Store message Here /////////
    const [sendingMessgeHere, setSendingMessage] = useState("");
    //////// All messges of channel  store here //////////////
    const [AllMessagesChannel, setAllMessgesOfChannel] = useState([]);
    //////// Message api call every second here ////////
    const [count, setCount] = useState(0)
    //////// Here store the setInterval id
    const [messageInterval, setmessageInterval] = useState(null);
    ///////  Here store channel interval
    const [ChannelInterval, setChannelInterval] = useState(null);
    ////////// Create and store Identity service //////
    const [IdentityServiceObject] = useState(
        () => new IdentityService(appConfig.region, appConfig.cognitoUserPoolId)
    );


    /////////// Here we  are creating design ///
    const customScrollbar = {
        '&::-webkit-scrollbar': {
            width: '0.3em',
            backgroundColor: 'rgba(255,255,255,0.5)',
            borderRadius: "5px",
        },
        '&::-webkit-scrollbar-thumb': {
            borderRadius: '1em',
            backgroundColor: 'rgba(0,0,0,0.8)',
        },
    }
    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        // '&:hover': {
        //     backgroundColor: alpha(theme.palette.common.white, 0.25),
        // },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    }));
    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: '#000000',
        position: "absolute",
        width: "100%",
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            //paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            //transition: theme.transitions.create('width'),
            paddingRight: "70px",
            width: '100%',

            [theme.breakpoints.up('sm')]: {
                '&:focus': {
                    color: "#333333",
                },
            },
        },
    }));



    useEffect(() => {
        if (user_id !== "") {
            clearInterval(ChannelInterval);
            setChannelList([]);
        }

    }, [user_id])

 

    ///////// Here  we are set the message value
    const handleChange = (event) => {
        setSendingMessage(event.target.value);
    };

    return (
        <>
            <Grid container spacing={1} >
                <Grid item md={3} px={1} sx={{ height: "510px" }}>
                    <Box height={"100%"} px={1} py={1} borderRadius="8px" border="1px solid #efefef" bgcolor={"#ffffff"}>
                        <Grid container display={"flex"} justifyContent="space-between">
                            <Typography mt={1} fontWeight="800" variant="subtitle2" color="secondary.dark" sx={{ opacity: "0.9" }}>Message</Typography>
                            <AddCircleOutlineOutlinedIcon
                                sx={{ fontSize: "18px", marginTop: "10px", cursor: "pointer" }}
                                // onClick={() => CreateChannel()}
                            />
                        </Grid>
                        <Grid container my={1.5}>
                            <TextField
                                size='small'
                                id="search_users_in_message_part"
                                label="Search"
                                value={searchUser}
                                onChange={(e) => setSearchUser(e.target.value)}
                            />
                        </Grid>
                        {
                            channelList.length !== 0 && channelList.map((d) =>
                                <Grid py={.2} container mt={1} sx={{ cursor: "pointer" }} onClick={() => setActiveChannel(d)}>
                                    <Box>
                                        <Avatar alt={d.Name} src="#" />
                                    </Box>
                                    <Box ml={1} pt={.6}>
                                        <Typography
                                            sx={{
                                                padding: "0px !important",
                                                lineHeight: "1",
                                                fontSize: "14px",
                                                fontWeight: "700"
                                            }}
                                            variant="subtitle1"
                                            color="secondary.dark"
                                        >
                                            {d.Name}
                                        </Typography>
                                        <Typography sx={{ fontSize: "11px", lineHeight: "1.5" }}
                                            variant="body2" color="secondary.dark">
                                            This is dummy text
                                        </Typography>
                                    </Box>
                                </Grid>
                            )
                        }

                    </Box>
                </Grid>
                <Grid item md={9} sx={{ height: "510px" }}>
                    <Box height={"100%"} borderRadius="8px" border="1px solid #efefef"
                        sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                        bgcolor={"#ffffff"}
                    >
                        {Object.keys(ActiveChannel).length > 3 &&
                            <>
                                <Grid
                                    sx={{
                                        borderBottom: "1px solid #333333",
                                        borderBottomLeftRadius: "8px",
                                        borderBottomRightRadius: "8px"
                                    }}
                                    pb={1}
                                    pt={1.5}
                                    pl={2}
                                    display="flex"
                                >
                                    <Box>
                                        <Avatar alt={ActiveChannel.Name} src="#" />
                                    </Box>
                                    <Box ml={1} pt={.6}>
                                        <Typography sx={{
                                            padding: "0px !important", lineHeight: "1",
                                            fontSize: "14px", fontWeight: "700"
                                        }}
                                            variant="subtitle1"
                                            color="secondary.dark">
                                            {ActiveChannel.Name}
                                        </Typography>
                                        <Typography
                                            sx={{ fontSize: "11px", lineHeight: "1.5" }}
                                            variant="body2" color="secondary.dark">Active now</Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            backgroundColor: "pink", width: "70%", display: "flex", justifyContent: "end",
                                            marginLeft: "3%", paddingRight: "1%", paddingTop: "5px",
                                        }}
                                    >
                                        <GroupAddIcon sx={{ cursor: "pointer" }} onClick={() => setMemberModel(true)} />
                                    </Box>
                                </Grid>
                                <Box container sx={customScrollbar} height="100%" pt={.5} position="relative" pb={.5} overflow="auto">
                                    {
                                        AllMessagesChannel.length !== 0 &&
                                        AllMessagesChannel.map((mes) => {
                                            if (mes.Sender.Name === member.username) {
                                                return <Box container sx={{
                                                    paddingRight: " 7px",
                                                    width: "100%", marginBottom: "7px", display: "flex", justifyContent: "right"
                                                }}
                                                    id="sender_messages"
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="secondary.dark"
                                                        sx={{
                                                            backgroundColor: "#5454D3",
                                                            width: "60%",
                                                            borderRadius: "5px",
                                                            padding: "7px",
                                                            color: "#ffffff"

                                                        }}
                                                    >
                                                        {mes.Content}
                                                    </Typography>
                                                </Box>
                                            } else {
                                                return <Box container sx={{
                                                    paddingLeft: " 7px",
                                                    width: "100%", marginBottom: "7px", display: "flex", justifyContent: "left"
                                                }}
                                                    id="reciver_message"
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="secondary.dark"
                                                        sx={{
                                                            backgroundColor: "#FBFBFB",
                                                            width: "60%",
                                                            borderRadius: "5px",
                                                            padding: "7px", opacity: 0.85, color: "#7A7A7A",
                                                        }}
                                                    >
                                                        {mes.Content}
                                                    </Typography>
                                                </Box>
                                            }
                                        })
                                    }



                                </Box>
                                <Grid pb={1} pt={1} pl={1} pr={1} id="sendMessage_input_and_add_File_icon">
                                    <Box sx={{ border: "1px solid #efefef", borderRadius: "10px", height: "40px", boxShadow: "0px 0px 10px 4px #eae7e7" }}>
                                        <TextField
                                            id="message_input"
                                            label=""
                                            value={sendingMessgeHere}
                                            onChange={handleChange}

                                        />

                                        <Search>
                                            {/* <StyledInputBase
                                                placeholder="Search…"
                                                inputProps={{ 'aria-label': 'search' }}
                                               // value={sendingMessgeHere}
                                                onChange={handleChange}
                                            /> */}

                                            <Box
                                                sx={{
                                                    width: "50px",
                                                    position: "absolute",
                                                    right: "15px",
                                                    display: "flex",
                                                    justifyContent: "space-between"
                                                }} id="send_message_but_and_add_file_icon">
                                                <Box
                                                    sx={{
                                                        padding: "4px",
                                                        width: "30px",
                                                        height: "30px",
                                                        marginTop: "4px",
                                                    }}
                                                >
                                                    <AttachFileIcon sx={{ fontSize: "20px" }} />
                                                </Box>
                                                <Box
                                                    sx={{
                                                        backgroundColor: "#5454d4",
                                                        padding: "4px",
                                                        borderRadius: "50px",
                                                        width: "30px",
                                                        height: "30px",
                                                        marginTop: "4px",
                                                    }}
                                                >
                                                    <NavigationIcon sx={{
                                                        transform: " rotate(90deg)", color: "#ffffff",
                                                        fontSize: "22px", cursor: "pointer"
                                                    }}
                                                        // onClick={() =>
                                                        //     sendMessageByUser(ActiveChannel, sendingMessgeHere, member)
                                                        // }
                                                    />
                                                </Box>
                                            </Box>
                                        </Search>
                                    </Box>
                                </Grid>
                            </>

                        }

                    </Box>

                </Grid>
            </Grid>
            {AddMemberModel && <ModelAddMemberInChannel
                AddMemberModel={AddMemberModel}
                setMemberModel={setMemberModel}
                AddAllUsers={AddAllUsers}
                ActiveChannel={ActiveChannel}
                user_id={user_id}
            />}
        </>
    )
}

export default MessageGrid