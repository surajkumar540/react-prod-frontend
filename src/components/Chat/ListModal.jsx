import { useState } from 'react';
import { IconButton, Box, Button, Typography, Modal, InputAdornment, OutlinedInput, Badge, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { ChatState } from '../../Context/ChatProvider';
import DeleteModal from '../../components/Chat/DeleteModal';
import { RemoveMemberInGroup, fetchAllChatSingleUserOrGroup } from '../../api/InternalApi/OurDevApi';
import { toast } from 'react-toastify';
import socket from "../../socket/socket";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 12,
  padding: '2rem',
  borderRadius: "6px"
};

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
      // animation: 'ripple 1.2s infinite ease-in-out',
      // border: '1px solid currentColor',
      content: '""',
    },
  },
}));


export default function ListModal({ buttonStyle, addMemberFunction }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [search, setSearch] = useState("")
  const { selectChatV1,setChats,setSelectedChatV1 } = ChatState();
  const [adminPosition,setAdminPosition]=useState(null)

  const fetchChat = async () => {
    try {
      const response = await fetchAllChatSingleUserOrGroup();

      console.log(response, "all fetchhhhhhhh")
      // setChats(response);
      // setSelectedChatV1(response)
      // setLoggedUser(localStorage.getItem("userInfo"));
    } catch (error) {
      console.log("Something is wrong");
    }
  }

  const removeMember = async (chatId, userId) => {
    try {
      const data = {
        "chatId": chatId,
        "userId": userId
      }
      const response = await RemoveMemberInGroup(data)
      if (response) {
        setSelectedChatV1(response)
        socket.emit("remove-member-in-group",{"RemoveMemberUserId":userId, response})
        toast.success("User removed successfully");
      } else {
        toast.error("User not removed")
      }
      handleClose()
    } catch (error) {
      toast.error("Something is wrong in delete")
    }
  }


  return (
    <div>
      <Button variant="contained" ml='1rem' sx={buttonStyle} size='small' onClick={handleOpen}>List of People</Button>


      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box sx={{ ...style, width: { xs: '90%', sm: 350, md: 420 } }}>

          <IconButton
            style={{
              position: "absolute", top: "3%", right: "4%", boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.2)', outline: 'none',
              cursor: "pointer",
              color: "#333333",
              fontSize: "18px",
              borderRadius: "50%",
              border: "1px solid #33333342",
              padding: "2px",
            }}
            onClick={() => setOpen(false)}
          >
            <CloseIcon sx={{ p: 0, fontSize: '15px' }} />
          </IconButton>

          <Typography id="modal-modal-title" color={'black'} fontSize={{ xs: '19px', sm: '22px' }} mb='.5rem'>
            List of People
          </Typography>

          <Box mb={".6rem"} display={'flex'} justifyContent={'space-between'}>
            <Typography id="modal-modal-title" variant="p" color={'#448DF0'} fontSize={{ xs: '13px', md: '16px' }}>
              # {selectChatV1?.chatName}
            </Typography>
            <Typography variant="p" color={'#BEBEBE'} fontSize={{ xs: '11px', md: '14px' }}>{selectChatV1 && selectChatV1?.users?.length} people</Typography>
          </Box>

          <Box my={".6rem"}>
            <OutlinedInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="input-with-icon-adornment"
              fullWidth
              size='small'
              placeholder="Search people here..."
              startAdornment={<InputAdornment position="start"><SearchIcon sx={{ color: '#BEBEBE' }} /></InputAdornment>}
            />
          </Box>

          <Box display={'flex'} flexDirection={'column'}>
          {
            selectChatV1?.users?.map((item, index) => {
              return <User key={index} name={item.name} role="front end developer" online={true} img={item.pic} id={item._id} removeMember={removeMember} chatId={selectChatV1._id} adminId={selectChatV1?.groupAdmin?._id}/>
            })
          }
          </Box>
          
        </Box>
      </Modal>
    </div>
  );
}






const User = ({ name, role, online = false, img,id,removeMember,chatId,adminId }) => {
  return (
    <Box display={'flex'} justifyContent={'space-between'} mt='1rem' order={id===adminId&&"-5"}>

      <Box display={'flex'} alignItems={'center'}>
        {
          online ? <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
            <Avatar alt="Remy Sharp" src={img} />
          </StyledBadge> : <Avatar alt="Remy Sharp" src={img} />
        }

        <Box>

        <Typography pl='8px' color="black" fontSize={{xs:'12px',md:'15px'}} textTransform={'capitalize'}>{name}</Typography>
        {id===adminId?<Typography pl='8px' color="green" fontSize={{xs:'9px',md:'11px'}} textTransform={'capitalize'}>admin</Typography>: <Typography pl='8px' color=" #A1A1A1" fontSize={{xs:'9px',md:'11px'}}  textTransform={'capitalize'}>
          {role}
        </Typography>}
       
        </Box>
      </Box>

      <Box >
      <Box display={'flex'} justifyContent='center' alignItems={'center'}>
        
        {(localStorage.getItem("userInfo")===adminId)&&<Box>
            {id!==adminId&&<IconButton>
              <DeleteModal type='list' handleDelete={()=>{removeMember(chatId,id)}}/>
            </IconButton>}
        </Box>}
      </Box>
      

      </Box>



    </Box>
  )
}