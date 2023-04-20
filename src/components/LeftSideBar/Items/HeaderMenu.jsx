import {
    Box, Toolbar, List, ListItem, ListItemButton, ListItemIcon, InputBase,
    ListItemText, Grid, CssBaseline, Typography, Divider, IconButton, Tooltip, Avatar, Menu, MenuItem,
    Button, FormHelperText, FormControl, Select, LinearProgress, Paper, CardMedia
} from '@mui/material/';
import EditIcon from '@mui/icons-material/Edit';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { useState } from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const HeaderMenu = () => {
    const navigate=useNavigate()
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const settings = ['Edit Profile',"Choose Theme","Add Account","Help", 'Logout'];
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
        if (data === 'Edit') {
            navigate("/account")
        }
        if (data === 'Dashboard') {
            navigate("/chat")
        }
        if (data === "Logout") {
            localStorage.clear();
            window.location = "/login";
        }
        setAnchorElUser(null);
    };
  return (
    <Box id="profile_icon"  px='.8rem'>
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
           
            <MenuItem onClick={() => handleCloseUserMenu("Edit")}>
                <ListItemIcon>
                    <EditIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center" fontSize={'14px'}>Edit Profile</Typography>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={() => handleCloseUserMenu("da")}>
                <ListItemIcon>
                    <ColorLensIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center"  fontSize={'14px'}>Choose Theme</Typography>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={() => handleCloseUserMenu("fd")}>
                <ListItemIcon>
                    <PersonAddAltIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center"  fontSize={'14px'}>Add Account</Typography>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={() => handleCloseUserMenu("ad")}>
                <ListItemIcon>
                    <HelpOutlineIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center"  fontSize={'14px'}>Help</Typography>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={() => handleCloseUserMenu("ds")}>
                <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center"  fontSize={'14px'}>Log out</Typography>
            </MenuItem>
        
        </Menu>
    </Box>
  )
}

export default HeaderMenu