import React from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';


const InviteSkipModal = () => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <div>
            <Button onClick={handleOpen}>Skip</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                
                <Fade in={open}>
                   
                    <Box sx={style}>
                        <Box display='flex' justifyContent='space-between'>
                            <Typography id="transition-modal-title" fontSize='16px' component="h2" fontWeight='bold'>
                                Skip without inviting?
                            </Typography>
                            <CloseIcon sx={{ p: 0, fontSize: '20px' }} />
                        </Box>
                        <Typography id="transition-modal-description" sx={{ mt: 2, }} fontSize='13px'  >
                            Get your team on board! Invite them now and start working
                            together towards achieving your goals
                        </Typography>

                        <Box display='flex' justifyContent='right' marginTop={4} gap={1}>
                            <Button
                                variant='outlined'
                                sx={{ width: "30%"}}
                                marginTop={2}
                            // onClick={() => createCompany()}
                            >
                                <Typography fontSize='11px'>Send invite</Typography>
                            </Button>

                            <Button
                                variant='contained'
                                sx={{ width: "35%" }}
                                marginTop={2}
                            // onClick={() => createCompany()}
                            >
                                Skip Now
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </div>
  )
}

export default InviteSkipModal