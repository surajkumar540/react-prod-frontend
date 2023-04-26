import React, { useEffect, useState } from 'react'
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
    Box, Toolbar, List, ListItem, InputBase,
    ListItemText, CssBaseline, Typography, Divider, Avatar,
    Button,FormControl,CardMedia
} from '@mui/material/';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import MuiDrawer from "@mui/material/Drawer"
import MuiAppBar from '@mui/material/AppBar';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

import { useLocation, useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ContentModels from '../../pages/ContentModels';
import { useMutation } from 'react-query';
import { fetchAllChatSingleUserOrGroup,fetchMessagesV1,sendV1Message , getCompanyName } from '../../api/InternalApi/OurDevApi';
import { toast } from 'react-toastify';
import { ChatState } from '../../Context/ChatProvider';
import { getSender } from '../../utils/chatLogic';
import oLogo from "../../assets/svg/oLogo.svg"
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import LogOutModal from '../Chat/LogOutModal';
import HeaderMenu from './Items/HeaderMenu';
import socket from "../../socket/socket";

const drawerWidth = '200px';

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const openedMixin = (theme) => ({
    // width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration['20000'],
    }),
    overflowX: 'hidden',
    boxShadow: 'inset 7px -2px 10px -5px rgba(0, 0, 0, 0.06)',
    borderRight:"0px",
    [theme.breakpoints.up('xs')]: {
        marginLeft: '3rem',
        display: 'none'
    },
    [theme.breakpoints.up('sm')]: {
        marginLeft: '3.8rem',
        display: 'inherit',
        width: '160px'
    },
    [theme.breakpoints.up('xl')]: {
        marginLeft: '4.3rem',
        width: drawerWidth,
    },
});

const closedMixin = (theme) => ({
    borderRight:"0px",
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.complex,
    }),
    overflowX: 'hidden',
    marginLeft: '5rem',
    width: `calc(${theme.spacing(0)} + 1px)`,
    [theme.breakpoints.up('xs')]: {
        width: `calc(${theme.spacing(0)} + 0px)`,
        display: 'none'
    },
    [theme.breakpoints.up('sm')]: {
        marginLeft: '2.8rem',
        display: 'inherit',
    },
    [theme.breakpoints.up('md')]: {
        marginLeft: '3.5rem',
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));



const styleCss = {
    appBarCss: {
        backgroundColor: "#ffffff !important",
        boxShadow: "none",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
        height: "65px",
    }
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 1),
    color: "#333333",
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 1),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        fontSize: "14px",
        color: "#333333",
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));



const LeftSideBar = (props) => {

    ////// use conetext use here
    const { user, setSelectedChatV1, pageNameContext, closeSideListContext, chats, setChats, compNameContext, setCompNameContext, notification, setNotification,setMessagingActive,setSelectedChannel,closeAppDrawer } = ChatState();
    console.log(closeAppDrawer,"checkingna fdsa")
    const theme = useTheme();
    const navegate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = React.useState(true);
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const settings = ['Edit Profile', "Choose Theme", "Add Account", "Help", 'Logout'];
    const [activePage, setActivePage] = useState("HomePage");
    const [activeChatId, setActiveChatId] = useState("")

    const [showGroups, setShowGroups] = useState(true);
    const [showInbox, setShowInbox] = useState(true);

    //////new model  open when click on the left side bar options and some others options like add folder and add teammate and so more
    const [openNewModel, setOpenNewModel] = useState(false);
    const [show, setShow] = useState(false);
    const [NewModelOpen, setNewModelOpen] = useState(false);
    const [activeModel, setActiveModel] = useState("")


    //////////// Store the userid of user ////////
    const [UserId, setUserId] = useState("");
    const [subUserId, setSubUserId] = useState("");
    useEffect(() => {
        if (pageNameContext === "Folder") {
            setOpen(!open);
        }
    }, [pageNameContext])


    //////// here we are call api to getting company name
    const [comNameSave, SetComName] = useState([]);
    const { mutateAsync: getComName, isLoading: GetComNameIsLoading } = useMutation(getCompanyName);

    const getComFun = async (subUserId = localStorage.getItem("userInfo")) => {
        try {
            const responseGetCom = await getComName(subUserId);
            if (responseGetCom.status !== 404 && responseGetCom?.status === true) {
                SetComName(responseGetCom?.data[0]?.companyName)     
            }
        } catch (error) {
            // toast.info("Company name is required");
            navegate("/companyDetail")
        }
    }
    useEffect(() => {
        if (compNameContext === "") {
            getComFun(subUserId);
        }
    }, [compNameContext])

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = (data = "") => {
        if (data === 'Edit Profile') {
            navegate("/account")
        }
        if (data === 'Dashboard') {
            navegate("/chat")
        }
        if (data === "Logout") {
            localStorage.clear();
            window.location = "/login";
        }
        setAnchorElUser(null);
    };

    const changePage = (indexVal) => {
        let pagesArray = ['dashboard', 'message', 'folder', 'data', 'privacy-policy', 'settings'];
        if (indexVal === 0) {
            navegate(`/`);
        } else {
            if (indexVal === 2) {
                setOpen(!open);
            }
            navegate(`/${pagesArray[indexVal]}`);
        }

    }

    ///// Show company Drop Down
    const [age, setAge] = React.useState(10);

    const handleChange = (event) => {
        setAge(event.target.value);
    };


    ////// Handle  Logout function
    const handleLogout = () => {
        localStorage.clear();
        window.location = "/login";
    }

    ///// navigate the page
    const navigatePage = (NavigateNewPage) => {
        navegate(`/${NavigateNewPage}`)
    }

    ///// Model Open function like create channel
    const modelOpens = () => {
        setOpenNewModel(true);/////this change the state in this page and then model show
        setShow(true);/////active model in diffrent page
        setActiveModel("CreateGroup");/////// which type of model active
        setNewModelOpen(true);////// Real dilog box open
    }

    const singleMessTeamMemberModel = () => {
        setOpenNewModel(true);/////this change the state in this page and then model show
        setShow(true);/////active model in diffrent page
        setActiveModel("SingleMemberChat");/////// which type of model active
        setNewModelOpen(true);////// Real dilog box open
    }



    /////////////////////////////////////////////////////
    /////////// Get the channel list and store  it //////
    //////// Here we are store a channel name list //////
    /////////////////////////////////////////////////////
    const [channelList, setChannelList] = useState([]);
    ///////  Here store channel interval
    const [ChannelInterval, setChannelInterval] = useState(null);
   

    //////// useLocation Check and update the state according to left sidebar options 
    useEffect(() => {
        if (location.pathname === "/chat") {
            setActivePage("groups");
        }

    }, [location])

    //when user in another page and want to acccess messaging part
    const InanotherPage = async (type, data) => {
        if (type === "1") {
            setSelectedChatV1(data);
            setMessagingActive(true);
            setSelectedChannel(data);
        } else {
            if (location.pathname !== "/chat") {
                setActivePage("groups");
                navegate(`/chat`)
            }
        }
    }


    /////// get the chat of selected group or selected member v1
    const { mutateAsync: userGroupFetchChat } = useMutation(fetchAllChatSingleUserOrGroup);
    // const [loggedUser, setLoggedUser] = useState(null);
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
    ////// If selected chat  value change then  this use effect run
    useEffect(() => {
        fetchChat();
        setSubUserId(localStorage.getItem("userInfo"))
    }, [])
    

    
    return (
        <>
            <Box id="main_container_box" sx={{ display: 'flex' }} >
                <CssBaseline />

                {
                    !closeAppDrawer&&<AppBar sx={styleCss.appBarCss} position="fixed" open={open}>
                        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box display={'flex'} width={drawerWidth && drawerWidth} alignItems={'center'}>

                                <Box flex={0.2}>
                                    <CardMedia
                                        className='blog-img'
                                        component="img"
                                        image={oLogo}
                                        alt="Image"
                                        sx={{ height: '40px', width: '40px' }}
                                        onClick={handleDrawerOpen}
                                    />
                                </Box>

                                <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: "500", fontSize: { base: '13px', sm: "15px", lg: '17px', xl: '22px' }, lineHeight: 2.75, color: '#646464', textTransform: "capitalize", flex: 0.8, textAlign: 'center' }}
                                    color="primary">
                                    {compNameContext || comNameSave?.length !== 0 && comNameSave}
                                </Typography>



                            </Box>

                            {/* <Box id="search_field_in_App_bar" pl='2rem'>
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon sx={{ fontSize: "18px" }} />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Search…"
                                        inputProps={{ 'aria-label': 'search' }}
                                        sx={{ border:'1px solid #BEBEBE'}}
                                    />
                                </Search>
                            </Box> */}

                            <Box sx={{ flexGrow: 0, width: "60%" }} display="inline-flex"
                                justifyContent={pageNameContext === "Data" ? 'space-between' : "end"}
                            >
                                {pageNameContext === "Data" &&
                                    <Box id="file_upload_icon">
                                        {/* <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#03CF80",
                                    color: "#ffffff",
                                    textTransform: "none"
                                }}
                                onClick={() => props.setOpen(true)}
                            >
                                Upload Data
                            </Button> */}
                                    </Box>
                                }

                                <Box id="show_for_all_pages_menu_opt" display={"inline-flex"} justifyContent={'space-between'} alignItems={'center'}>

                                    <Box id="notification_icon" px='1rem' display={'flex'} alignItems={'center'} >
                                        <NotificationsNoneOutlinedIcon
                                            sx={{ width: "28px", height: "28px", fontSize: '30px', color: "#333", opacity: 0.5 }} />
                                    </Box>
                                    {/* <Box id="profile_icon"  px='.8rem'>
                                        <Tooltip title="Open settings">
                                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                                <Avatar src="https://images.pexels.com/photos/8864285/pexels-photo-8864285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                                alt="Remy Sharp" sx={{ width: "32px", height: "32px" }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            sx={{ mt: '45px' }}
                                            id="menu-appbar"
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={Boolean(anchorElUser)}
                                            onClose={() => handleCloseUserMenu()}
                                        >
                                            {settings.map((setting) => (
                                                <>
                                                <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                                                    <ListItemIcon>
                                                        <EditIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <Typography textAlign="center">{setting}</Typography>
                                                </MenuItem>
                                                </>
                                            ))}
                                        </Menu>
                                    </Box> */}
                                    <HeaderMenu />
                                </Box>
                            </Box>
                        </Toolbar>
                    </AppBar>
                }


                {/* New sidebar  */}
                {!closeAppDrawer&&<Box height={'100vh'}  position={'fixed'} width={{ xs: '60px', xl:'70px' }} display={{ xs: 'none', sm: 'flex' }} flexDirection={'column'} overflow={'hidden'} top='0' boxShadow={closeSideListContext&&'4px 0px 16px rgba(0, 0, 0, 0.04)'}>


                    <Box borderBottom={'1px solid rgba(0, 0, 0, 0.06)'} height={'65px'} width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'} visibility={open ? "normal" : "hidden"}>
                        <CardMedia
                            className='blog-img'
                            component="img"
                            image={oLogo}
                            alt="Image"
                            sx={{ height: '40px', width: '40px' }}
                        />
                    </Box>



                    <Box bgcolor={'white'} height={'5rem'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} onClick={() => { navigatePage("chat") }}>
                        <Button display='flex' flexDirection='column' sx={{
                            color: location.pathname.split(['/'])[1] === "chat" ? "#448DF0" : "#646464"
                        }}
                        >
                            <ChatTwoToneIcon fontSize='small' />
                        </Button>
                        <Typography sx={{ color: location.pathname.split(['/'])[1] === "chat" ? "#448DF0" : "#646464", fontSize: '14px',cursor:"pointer" }}>Chat</Typography>
                    </Box>



                    <Box bgcolor={'white'} height={'5rem'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} onClick={() => { navigatePage("files/allFiles") }}>
                        <Button  display='flex' flexDirection='column' sx={{
                            color: location.pathname.split(['/'])[1] === "files" ? "#448DF0" : "#646464"
                        }}
                        >
                            <ArticleOutlinedIcon fontSize='small' />
                        </Button>
                        <Typography sx={{ color: location.pathname.split(['/'])[1] === "files" ? "#448DF0" : "#646464", fontSize: '14px',cursor:"pointer" }}>Files</Typography>
                    </Box>

                    <Box bgcolor={'white'} height={'5rem'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} onClick={() => { navigatePage("account") }} >
                        <Button display='flex' flexDirection='column' sx={{
                            color: location.pathname === "/account" ? "#448DF0" : "#646464"
                        }}
                        >
                            <AccountCircleOutlinedIcon fontSize='small' />
                        </Button>
                        <Typography sx={{ color: location.pathname.split(['/'])[1] === "account" ? "#448DF0" : "#646464", fontSize: '12.5px',cursor:"pointer" }}>Account</Typography>
                    </Box>


                </Box>}



                {!closeAppDrawer&&<Drawer
                    variant="permanent"
                    open={open && !closeSideListContext}
                    position='relative'
                >

                   
                    <DrawerHeader />

                    {open && <Box>

                        <Divider />

                        <FormControl sx={{ m: 1, minWidth: 120, paddingLeft: "15px", paddingRight: "15px", }}>
                            {/* <Box>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    border: "1px solid #3333336e", width: "auto", borderRadius: "5px",
                                    padding: "10px", fontSize: "15px", fontWeight: "800",
                                    color: "#333333e8", backgroundColor: "#534d4d14", position: "relative"
                                }}
                            >
                                <BusinessIcon /><span style={{ position: "absolute", marginTop: "3px", marginLeft: "5px", textTransform: "capitalize" }}>{comNameSave.length !== 0 && comNameSave[0].companyName}</span>
                            </Typography>
                        </Box> */}
                            {/* <Select
                            value={age}
                            onChange={handleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label', }}
                        >
                            <MenuItem value={10}>Microsoft</MenuItem>
                            <MenuItem value={20}>Google</MenuItem>
                        </Select> */}
                        </FormControl>

                        {
                            location.pathname.split(['/'])[1] === "chat" && (
                                <>
                                    <Box id="channel_box">
                                        <Box sx={{ paddingLeft: { sm: '10px', md: "25px" }, paddingRight: { sm: '10px', md: "25px" } }} onClick={() => { setShowGroups(!showGroups) }}>
                                            <Button
                                                id="channel-create-button"
                                                aria-controls={open ? 'basic-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={() => { setActivePage("groups"); setActiveChatId(""); }}
                                                variant={activePage === "groups" ? "contained" : "text"}
                                                size='small'
                                                sx={{
                                                    width: "100%", justifyContent: 'flex-start',
                                                    color: activePage === "groups" ? "#ffffff" : "#646464"
                                                }}
                                                endIcon={<KeyboardArrowDownIcon sx={{ position: "absolute", right: "10px", top: "8px" }} />}
                                            >
                                                <GroupAddIcon sx={{ fontSize: "20px", marginRight: "8px" }} />
                                                <span style={{ fontSize: "13px", textTransform: "capitalize", paddingTop: "2px", }}>
                                                    Groups
                                                </span>
                                            </Button>
                                        </Box>
                                        {showGroups && <Box>
                                            <List sx={{ paddingTop: "5px" }} >

                                                {
                                                    //channelList.length !== 0 && channelList.map((d) =>
                                                    chats.length !== 0 && chats?.map((d, index) =>

                                                        <ListItem
                                                            key={index}
                                                            sx={{ paddingTop: "2px", paddingBottom: "0px", paddingLeft: { sm: '25px', md: '40px', xl: "42px" }, cursor: "pointer" }}
                                                        
                                                            onClick={() => { location.pathname === "/chat" ? InanotherPage("1", d) : InanotherPage("2", d); setActiveChatId(d?._id); setActivePage("groups") }
                                                            }
                                                        >
                                                            <ListItemText
                                                                primary={
                                                                    Object.keys(d).length > 0 &&
                                                                    (d?.isGroupChat && (`# ${d?.chatName}`))
                                                                }
                                                                sx={{
                                                                    textTransform:"capitalize",
                                                                    opacity: open ? 1 : 0, marginTop: "0px",
                                                                    marginBottom: "0px", "& span": { fontSize: "13px", fontWeight: activeChatId == d?._id ? 700 : 500, color: activeChatId == d?._id ? "#3976C9" : "#333333b5" }
                                                                }}
                                                            />
                                                        </ListItem>
                                                    )
                                                }
                                                <ListItem
                                                    sx={{
                                                        paddingTop: "0px", paddingBottom: "0px",
                                                        paddingLeft: { sm: '22px', md: '38px', xl: "42px" }, cursor: "pointer"
                                                    }}
                                                    onClick={() => modelOpens()}
                                                >
                                                    <AddBoxOutlinedIcon
                                                        sx={{
                                                            fontSize: "13px", marginTop: "0px", marginRight: "2px", color: "#333333b4",
                                                        }} />
                                                    <ListItemText
                                                        primary={`Create Group`}
                                                        sx={{
                                                            opacity: open ? 1 : 0,
                                                            marginTop: "3px", marginBottom: "0px",
                                                            "& span": { fontSize: "13px", fontWeight: 500, color: "#333333b5" }
                                                        }}
                                                    />
                                                </ListItem>
                                            </List>
                                        </Box>}
                                    </Box>



                                    <Box id="single_user_box" >
                                        <Box sx={{ marginTop: '.5rem', paddingLeft: { sm: '10px', md: "25px" }, paddingRight: { sm: '10px', md: "25px" } }} onClick={() => setShowInbox(!showInbox)}>
                                            <Button
                                                id="single-user-inbox-create-button"
                                                aria-controls={open ? 'basic-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={() => { setActivePage("inbox"); setActiveChatId(""); }}
                                                // onClick={() => {navigatePage(""),setActivePage("inbox")}}
                                                variant={activePage === "inbox" ? "contained" : "text"}
                                                size='small'
                                                sx={{
                                                    width: "100%", justifyContent: 'flex-start',
                                                    color: activePage === "inbox" ? "#ffffff" : "#646464"
                                                }}
                                                endIcon={<KeyboardArrowDownIcon sx={{ position: "absolute", right: "10px", top: "8px" }} />}
                                            >
                                                <GroupAddIcon sx={{ fontSize: "20px", marginRight: "8px" }} />
                                                <span style={{ fontSize: "13px", textTransform: "capitalize", paddingTop: "2px", }}>
                                                    Inbox
                                                </span>
                                            </Button>
                                        </Box>

                                        {showInbox && <Box>
                                            <List sx={{ padding: "0px" }} >
                                                {chats.length !== 0 && chats.map((d, index) =>

                                                    <ListItem
                                                        key={index}
                                                        sx={{ paddingTop: "0px", paddingBottom: "0px", paddingLeft: { sm: '25px', md: "40px", xl: '42px' }, cursor: "pointer" }}
                                                        onClick={() => { location.pathname === "/chat" ? InanotherPage("1", d) : InanotherPage("2", d); setActiveChatId(d?._id); setActivePage("inbox") }
                                                        }
                                                    >
                                                        {
                                                            Object.keys(d).length > 0 && (
                                                                !d?.isGroupChat && <Avatar
                                                                    alt="Remy Sharp"
                                                                    src="https://images.pexels.com/photos/839633/pexels-photo-839633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                                                    sx={{ width: 12, height: 12, mr: '8px' }}
                                                                />
                                                            )

                                                        }

                                                        <ListItemText
                                                            primary={
                                                                Object.keys(d).length > 0 &&
                                                                ((!d?.isGroupChat && getSender(user, d.users)).length < 11 ? (!d?.isGroupChat && getSender(user, d.users)) : (!d?.isGroupChat && getSender(user, d.users).slice(0, 10) + " .."))
                                                            }
                                                            sx={{
                                                                textTransform:"capitalize",
                                                                opacity: open ? 1 : 0, marginTop: "1px",
                                                                marginBottom: "0px", "& span": { fontSize: "13px", fontWeight: activeChatId == d?._id ? 700 : 500, color: activeChatId == d?._id ? "#3976C9" : "#333333b5" }
                                                            }}
                                                        />
                                                    </ListItem>
                                                )
                                                }
                                                <ListItem
                                                    sx={{
                                                        paddingTop: "0px", paddingBottom: "0px",
                                                        paddingLeft: { sm: '22px', md: '38px', xl: "42px" }, cursor: "pointer"
                                                    }}
                                                    onClick={() => singleMessTeamMemberModel()}
                                                >
                                                    <AddBoxOutlinedIcon
                                                        sx={{
                                                            fontSize: "13px", marginTop: "4px", marginRight: "2px", color: "#333333b4",
                                                        }} />
                                                    <ListItemText
                                                        primary={`Add Mamber`}
                                                        sx={{
                                                            opacity: open ? 1 : 0, marginTop: "4px",
                                                            marginBottom: "0px",
                                                            "& span": { fontSize: "13px", fontWeight: 500, color: "#333333b5" }
                                                        }}
                                                    />
                                                </ListItem>
                                            </List>
                                        </Box>}
                                    </Box>
                                </>
                            )
                        }


                        {
                            location.pathname.split(['/'])[1] == 'files' && (
                                <>
                                    <Box id="all_files" mt={1} >
                                        <Box sx={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                            <Button
                                                id="all_file_button"
                                                aria-controls={open ? 'basic-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={() => navigatePage("files/allFiles")}
                                                variant={location.pathname === "/files/allFiles" ? "contained" : "text"}
                                                size='small'
                                                sx={{
                                                    width: "100%", justifyContent: 'flex-start',
                                                    color: location.pathname === "/files/allFiles" ? "#ffffff" : "#646464"
                                                }}
                                            >
                                                <TextSnippetIcon sx={{ fontSize: "18px", marginRight: "8px" }} />
                                                <span style={{ fontSize: "13px", textTransform: "capitalize", paddingTop: "2px" }}>
                                                    All files
                                                </span>
                                            </Button>
                                        </Box>
                                    </Box>
                                    <Box id="Upload_file_box" mt={1}>
                                        <Box sx={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                            <Button
                                                id="upload-file-button"
                                                aria-controls={open ? 'basic-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={() => navigatePage("files/upload")}
                                                variant={location.pathname === "/files/upload" ? "contained" : "text"}
                                                size='small'
                                                sx={{
                                                    width: "100%", justifyContent: 'flex-start',
                                                    color: location.pathname === "/files/upload" ? "#ffffff" : "#646464"
                                                }}
                                            >
                                                <CloudUploadOutlinedIcon sx={{ fontSize: "18px", marginRight: "8px" }} />
                                                <span style={{ fontSize: "13px", textTransform: "capitalize", paddingTop: "2px" }}>
                                                    Upload Data
                                                </span>
                                            </Button>
                                        </Box>
                                    </Box>

                                    <Box id="create_folder_box" mt={1}>
                                        <Box sx={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                            <Button
                                                id="create_folder-button"
                                                aria-controls={open ? 'basic-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={() => navigatePage("files/folder")}
                                                variant={
                                                    location.pathname === ("/files/folder")||location.pathname.slice(0,13)=="/files/folder" ? "contained" : "text"
                                                }
                                                size='small'
                                                sx={{
                                                    width: "100%", justifyContent: 'flex-start',
                                                    color: location.pathname === "/files/folder"||location.pathname.slice(0,13)=="/files/folder" ? "#ffffff" : "#646464"
                                                }}
                                            >
                                                <FolderOutlinedIcon sx={{ fontSize: "18px", marginRight: "8px" }} />
                                                <span style={{ fontSize: "13px", textTransform: "capitalize", paddingTop: "2px" }}>
                                                    All Folders
                                                </span>
                                            </Button>
                                        </Box>
                                    </Box>

                                    {/* <Box id="my_account_box" mt={1}>
                                    <Box sx={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                        <Button
                                            id="my-account-button"
                                            aria-controls={open ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={() => navigatePage("upload")}
                                            variant="contained"
                                            size='small'
                                            disabled={true}
                                            sx={{ width: "100%", justifyContent: 'flex-start' }}
                                        >
                                            <PersonIcon sx={{ fontSize: "18px", marginRight: "8px" }} />
                                            <span style={{ fontSize: "13px", textTransform: "capitalize", paddingTop: "2px" }}>
                                                My Account
                                            </span>
                                        </Button>
                                    </Box>
                                </Box>
                                <Box id="settings_box" mt={1}>
                                    <Box sx={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                        <Button
                                            id="setting-button"
                                            aria-controls={open ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={() => navigatePage("upload")}
                                            variant="contained"
                                            size='small'
                                            disabled={true}
                                            sx={{ width: "100%", justifyContent: 'flex-start' }}
                                        >
                                            <SettingsOutlinedIcon sx={{ fontSize: "18px", marginRight: "8px" }} />
                                            <span style={{ fontSize: "13px", textTransform: "capitalize", paddingTop: "2px" }}>
                                                Settings
                                            </span>
                                        </Button>
                                    </Box>
                                </Box>
                                <Box id="StorageProgrssBar" mx={3.5} mt={2}>
                                    <Box sx={{ width: '100%' }}>
                                        <LinearProgress variant="determinate" value={20} />
                                    </Box>
                                    <Box display={'flex'} justifyContent={"space-between"}>
                                        <Typography sx={{ fontSize: "10px", fontWeight: "600" }} variant="body2">0 MB</Typography>
                                        <Typography sx={{ fontSize: "10px", fontWeight: "600" }} variant="body2">1 GB</Typography>
                                    </Box>
                                </Box> */}
                                </>
                            )
                        }


                        {/* <Box id="logout_box" sx={{ position: "absolute", bottom: "0%", width: "100%", borderTop: "1px solid #CFCFCF", paddingTop: { sm: '8px', md: "10px" }, background: "white" }} mt={1}>
                            <Box sx={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                <LogOutModal handleLogout={handleLogout} />
                            </Box>
                        </Box> */}

                        <List sx={{
                            paddingLeft: open ? "25px" : "5px",
                            paddingRight: open ? "25px" : "5px"
                        }}>
                    
                        </List>

                    </Box>}
                </Drawer>}
                
                {/* Drawer toggle icon */}
                {(!closeSideListContext&&!closeAppDrawer) && 
                <Box height={'96vh'} width='15px' display={{ xs: 'none', sm: 'flex' }} overflow={'hidden'} flexDirection={'column'}borderRight='2px solid  rgba(0, 0, 0, 0.06)' zIndex={'999'} boxShadow={'4px 0px 18px rgba(0, 0, 0, 0.06)'}>     
                    <Box 
                        position={'absolute'}
                        bottom={'18%'}
                    >
                        {
                            open ? <ChevronLeftIcon sx={{ fontSize: "1.5rem", bgcolor: 'whitesmoke', boxShadow: '4px 0px 18px rgba(0, 0, 0, 0.06)', border: '1px solid rgba(0, 0, 0, 0.4)', color: 'gray', borderRadius: "50%" }} onClick={() => handleDrawerClose()} /> : (
                                <ChevronRightIcon sx={{ fontSize: "1.5rem", bgcolor: 'whitesmoke', boxShadow: '4px 0px 18px rgba(0, 0, 0, 0.06)', border: '1px solid rgba(0, 0, 0, 0.4)', color: 'gray', borderRadius: "50%" }} onClick={handleDrawerOpen} />
                            )
                        }
                    </Box>
                </Box>
                     }



                {/* <DrawerHeader /> */}
                <Box component="main" sx={{ flexGrow: 1, py: 2.2, px: 0 }}>
                    <Box mt={3}>
                        {
                            props.children
                        }
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
                    InanotherPage={InanotherPage}
                />
            }
        </>
    )
}

export default LeftSideBar



