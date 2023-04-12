import {useState,useEffect} from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteModal from './DeleteModal';
import { Typography } from '@mui/material';
// const options = [
//   'Delete',
//   'Add Files'
// ];

const ITEM_HEIGHT = 48;

export default function DotMenu({handleDelete,handleAddFile,value,pageName='folder'}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  

  return (
    <div>
      
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        { 
          pageName==='folder'&&<MenuItem>
            <Typography onClick={()=>{handleAddFile();handleClose()}}>Add File</Typography>
          </MenuItem>}
          <MenuItem>
            <DeleteModal handleDelete={handleDelete} value={value} closeParentModal={handleClose} pageName={pageName}/> 
          </MenuItem>
          
       </Menu>
    </div>
  );
}