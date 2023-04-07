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

const AllFiles = () => {
    const navigate = useNavigate();

    const [userFiles, setUserFiles] = useState([]);
    const [UserId, setUserId] = useState("");

    // const colorsCode = ["#FBCFFF", "#FFCFCF", "#CFFFDD", "#CFEEFF", "#FFE9CF", "#CFE8FF", "#FFF2CF", "#FFCEE0", "#FFD5CF", "#DECFFF"]
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


    const selectRandomColor = () => {
        return colorsCode[Math.floor(Math.random() * 10)];
    }
    const style = {
        folderCreateMainBox: {
            minHeight: "500px", backgroundColor: "transparent",
        }
    }

    useEffect(() => {
        const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
        setUserId(UserId);
    }, [])

    /////// Get files of this user
    const getFilesOfUser = async (userId) => {
        const userID = { userId: userId }
        const response = await axios.post('https://devorganaise.com/api/getfiles', userID, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const FilesResponse = response.data;
        if (FilesResponse.status) {
            const FilesData = FilesResponse.data;
            FilesData.forEach((item)=>{
                const ext=item.fileName.split(['.'])[1];
                console.log(ext)
            })
            setUserFiles(FilesData)
        } else {
            toast.error(FilesResponse.message);
        }

    }

    useEffect(() => {
        // const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
        if (UserId !== "") {
            getFilesOfUser(UserId);
        }
    }, [UserId])

    ///////////// Delete fie code add here
    const { mutateAsync: deleteFileApiCall, isLoading: delFileIsLoading } = useMutation(deleteFileApi)
    const ActionDelFile = async (data) => {
        const confarmDelete = window.confirm("Are you sure do u want to delete this file.");
        if (confarmDelete) {
            // const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
            const createDeleteObj = { fileId: data._id, userId: UserId };
            const resData = await deleteFileApiCall(createDeleteObj);
            if (resData.status) {
                toast.success(resData.message);
                if (debouncedSearchTerm !== "") {
                    const afterDelFilterFile = userFiles.filter((srcFiles) => srcFiles.fileId !== data.fileId);
                    setUserFiles(afterDelFilterFile);
                    if (afterDelFilterFile.length === 0) {
                        SetSrcFileText("");
                    }
                } else {
                    getFilesOfUser(UserId);
                }
            } else {
                toast.error(resData.message);
            }
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
                getFilesOfUser(UserId);
            }

        }

    }, [debouncedSearchTerm, UserId])


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
                                        id="search_folder"
                                        placeholder='Search file'
                                        size='small'
                                        sx={{
                                            marginRight: "10px", "& input": {
                                                paddingTop: "7px",
                                                paddingBottom: "7px", fontSize: "14px"
                                            },
                                            paddingLeft: "4px", "& fieldset": { borderRadius: "8px" }
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
                                        sx={{ padding: "5px 20px" }}
                                        onClick={() => navigate("/files/upload")}
                                    >
                                        Add File
                                    </Button>
                                </Box>

                            </Box>
                        </Grid>
                        <Grid container item mt={3} xs={12} display={'flex'} >
                            {userFiles.length !== 0 && userFiles.map((d) =>
                                <Box marginRight={"25px"} my={"10px"} sx={{
                                    width: "170px",
                                    height: "170px",
                                    padding: "5px 5px",
                                    boxSizing: "border-box",
                                    border: "0.5px solid #CBCBCB", borderRadius: "8px"
                                }}>
                                    <Box container display={'flex'} justifyContent="end">
                                        {/* <MoreVertIcon sx={{ fontSize: "18px", color: '#7A7A7A' }} /> */}
                                        <DeleteForeverIcon
                                            sx={{
                                                fontSize: "19px",
                                                cursor: "pointer",
                                                marginRight: "5px",
                                                color: "#e70f0fc2"
                                            }}
                                            onClick={() => ActionDelFile(d)}
                                        />
                                    </Box>
                                    <Box container display={'flex'} justifyContent="center">
                                        {/* <TextSnippetIcon sx={{
                                            fontSize: '80px',
                                            color:colorsCode[d.fileName.split(['.'])[1]]||"#2892e7d6"
                                            //selectRandomColor() 
                                        }} /> */}
                                        <FileIcon ext={d.fileName.split(['.'])[1]}/>
                                    </Box>
                                    <Box container>
                                        <Typography align='center' variant="subtitle2" color={"#121212"}>
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