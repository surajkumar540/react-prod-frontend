import React, { useState, useEffect } from 'react'
import LeftSideBar from '../components/LeftSideBar/LeftSideBar'
import { Button, Box, Grid, Typography, InputAdornment, IconButton } from '@mui/material/';
import fileUploadImage from "../assets/BackgroundImages/folder-data.png";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderIcon from '@mui/icons-material/Folder';
import TextField from '@mui/material/TextField'
import { AccountCircle } from '@mui/icons-material';
import { Search } from '@mui/icons-material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useMutation } from 'react-query';
import { deleteFileApi } from '../api/InternalApi/OurDevApi';
import { useDebounce } from 'use-debounce';
import FileIcon from '../components/FileUploadModal/Icons/FileIcon';
import DeleteModal from '../components/Chat/DeleteModal';
import DotMenu from '../components/Chat/DotMenu';
import Loader from '../components/Tools/Loader';

const AllFiles = () => {
    const navigate = useNavigate();
    const [loading,setLoading]=useState(false);
    const [userFiles, setUserFiles] = useState([]);
    const [UserId, setUserId] = useState("");
    const [showSearchSmall,setShowSearchSmall]=useState(false)

   const colorsCode={
        doc:'#2892e7d6',
        docx:'#2892e7d6',
        png:'#7CB2D2aa',
        jpeg:'#74BE73aa',
        jpg:'#74BE73',
        pdf:'#EE2F37',
        mkv:'#478559aa',
        exe:'#ff8928',
        gif:'#405de6aa',
        htm:'#539568',
        html:'#539568',
        jar:'#ffc202',
        zip:'#F0BC2C',
        bat:'#c0ff2d',
        bin:'#ffabb6',
        csv:'#ffaaab',
        iso:'#c89666',
        mp4:'#8076a3',
        mp3:'#9950A6',
        mpeg:'#00beffaa',
        ppsx:'#ffcb00',
        rar:'#9bc400aa',
        tmp:'#ec1f52aa',
        txt:'#5D68BF',
        xls:'#67AA46',
        ppt:'#F68852',
        eps:'#EFA162',
        wav:'#176E88',
        css:'#95BCD4',
        mov:'#006CB7',
        psd:'#297CAF',
    }
   
    const style = {
        folderCreateMainBox: {
            minHeight: "500px", backgroundColor: "transparent",
        }
    }

    /////// Get files of this user
    const getFilesOfUser = async () => {
        setLoading(true)
        const response = await axios.get('https://devorganaise.com/api/v2/file/getfiles', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const FilesResponse = response.data;
        console.log(FilesResponse,'response of file')
        if (FilesResponse.status) {
            const FilesData = FilesResponse.data;
            setUserFiles(FilesData)
        } else {
            toast.error(FilesResponse.message);
        }
        setLoading(false)
    }

    useEffect(() => {
        getFilesOfUser();
    }, [])

    ///////////// Delete fie code add here

    const { mutateAsync: deleteFileApiCall, isLoading: delFileIsLoading } = useMutation(deleteFileApi)
    const ActionDelFile = async (data) => {
        
        // const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
        const createDeleteObj = { fileId: data._id};
        const resData = await deleteFileApiCall(createDeleteObj);
        console.log(resData,'delete file by suraj')
            if (resData.status) {
                toast.success(resData.message);
                if (debouncedSearchTerm !== "") {
                    const afterDelFilterFile = userFiles.filter((srcFiles) => srcFiles.fileId !== data.fileId);
                    setUserFiles(afterDelFilterFile);
                    if (afterDelFilterFile.length === 0) {
                        SetSrcFileText("");
                    }
                } else {
                    getFilesOfUser();
                }
            } else {
                toast.error(resData.message);
            }
   

    }

    ///////////// Search file 
    const [srcFileText, SetSrcFileText] = useState("");
    const [debouncedSearchTerm] = useDebounce(srcFileText, 500);
    useEffect(() => {
        if (debouncedSearchTerm !== "") {
            const searchingFiles = userFiles.filter((srcFiles) => srcFiles.fileName.toLowerCase().startsWith(debouncedSearchTerm.toLowerCase()));
            setUserFiles(searchingFiles);
        } else {
            if (UserId !== "") {
                getFilesOfUser();
            }

        }

    }, [debouncedSearchTerm, UserId])

    if(loading)
    {
        return(
        <LeftSideBar data={{ pageName: "data", index: 2 }}>
            <Loader/>
        </LeftSideBar>
        )
    }

    return (
        <LeftSideBar data={{ pageName: "data", index: 2 }}>
            <Box px={"20px"} sx={style.folderCreateMainBox}>
                {userFiles.length === 0 &&
                    <Grid container>
                        <Grid container item xs={12} mt={2} display="flex"  justifyContent={'center'}>
                            <img src={fileUploadImage} style={{ width: "350px", userSelect: "none", pointerEvents: "none" }} alt="folder-creating-image" />
                        </Grid>
                        <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                            <Typography variant="subtitle1" fontWeight={"600"} >No files added yet</Typography>
                        </Grid>
                        <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                            <Typography sx={{ width: { sm: "75%", md: "45%" } }} color="#808191" variant="body2" textAlign={'center'}>
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                            </Typography>
                        </Grid>
                        <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                            <Button
                                variant="contained"
                                size='small'
                                sx={{ padding: "5px 25px" }}
                                onClick={() => navigate("/files/upload")}
                            >
                                Add File
                            </Button>
                        </Grid>
                    </Grid>
                }

                {userFiles.length !== 0 &&
                    <Grid container px={1} >
                        <Grid container item mt={2} xs={12} >
                            <Box container width={"100%"} display={'flex'} justifyContent="space-between">
                                <Typography variant="h6" >All Files</Typography>
                                <Box >
                                    <TextField
                                        onClick={()=>setShowSearchSmall(true)}
                                        id="search_folder"
                                        placeholder='Search file'
                                        size='small'
                                        sx={{
                                            width:{xs:showSearchSmall?"150px":'50px',sm:'140px',md:'180px',xl:'220px'},
                                            marginRight: "10px", 
                                            "& input": {
                                                paddingTop: "7px",
                                                paddingBottom: "7px", fontSize: "14px"
                                            },
                                            paddingLeft: "4px", 
                                            "& fieldset": { borderRadius: "8px" }
                                        }}
                                        value={srcFileText}
                                        onChange={(e) => SetSrcFileText(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search sx={{ color: "#efefef" }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        size='small'
                                        sx={{ padding:{xs: "4px 15px",sm:"5px 20px"},textTransform:'capitalize' }}
                                        onClick={() => navigate("/files/upload")}
                                    >
                                        Add Files
                                    </Button>
                                </Box>

                            </Box>
                        </Grid>
                        <Grid container item mt={3} xs={12} display={'flex'} flexWrap={'wrap'} >
                            {userFiles.length !== 0 && userFiles.map((d) =>
                                <Box marginX={{xs:"10px",sm:"3px",md:"25px"}} my={"10px"} sx={{
                                    width: {xs:"130px",sm:'155px',md:"170px"},
                                    height: {xs:"150px",sm:'170px',md:"180px"},
                                    padding: "5px 5px",
                                    boxSizing: "border-box",
                                    border: "0.5px solid #CBCBCB", borderRadius: "8px"
                                }}>
                                    <Box container display={'flex'} justifyContent="end">
                                        <DotMenu handleDelete={ActionDelFile} value={d} pageName='files'/>
                                        {/* <DeleteModal handleDelete={ActionDelFile} value={d} /> */}
                                    </Box>
                                    <Box container display={'flex'} justifyContent="center">
                                      
                                        <FileIcon ext={d.fileName.split(['.'])[1]}/>
                                    </Box>
                                    <Box container>
                                        <Typography align='center' variant="subtitle2" color={"#121212"} fontSize={{xs:"0.79rem",sm:"0.875rem"}}>
                                            {d.fileName.split(".")[0].length > 15 ? d.fileName.split(".")[0].substring(0, 14) : d.fileName.split(".")[0]}
                                        </Typography>
                                    </Box>
                                    <Box container>
                                        <Typography align='center' variant="subtitle2" fontSize={"13px"}
                                            color={"#CDCDCD"}>
                                            {`${Math.abs(parseInt(d.fileSize) / 1000000) % 1 !== 0 ? Math.abs(parseInt(d.fileSize) / 1000000).toFixed(2) : Math.floor(Math.abs(parseInt(d.fileSize) / 1000000))} MB`}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                }
            </Box>
        </LeftSideBar>
    )
}

export default AllFiles