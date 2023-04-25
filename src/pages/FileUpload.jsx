import React, {useEffect, useState } from 'react'
import { Button, Box, Grid, Typography } from '@mui/material/';
import fileUploadImage from "../assets/BackgroundImages/upload-file.png";
import FileUploadModal from '../components/FileUploadModal/FileUploadModal';
import { ChatState } from '../Context/ChatProvider';

const FileUpload = () => {
    const {setPageNameContext,setCloseSideList}=ChatState()
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    
    useEffect(()=>{
        setPageNameContext("data")
        setCloseSideList(false)
    },[])

    const styleCss = {
        fileUploadMainBox: {
            minHeight: "500px", backgroundColor: "transparent",
        }
    }
 

    return (
        <>
            <Box sx={styleCss.fileUploadMainBox}>
                <Grid container>
                    <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                        <img src={fileUploadImage} style={{ width: "350px", userSelect: "none", pointerEvents: "none" }} alt="file-upload-image" />
                    </Grid>
                    <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                        <Typography variant="subtitle1" fontWeight={"500"} >No data added yet</Typography>
                    </Grid>
                    <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                        <Typography sx={{ width: { sm: "75%", md: "45%" } }} color="#808191" variant="body2" textAlign={'center'} fontWeight={600}>
                            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                        </Typography>
                    </Grid>
                    <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                        <Button variant="contained" onClick={() => handleClickOpen()} size='small'
                         sx={{ padding: "5px 25px" }}>
                            Upload Data
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            {
                open && <FileUploadModal open={open} handleClose={handleClose} />
            }
        </>
    )
}

export default FileUpload