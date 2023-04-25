import React, { useState, useEffect } from 'react'
import { Button, Box, Grid, Typography, InputAdornment } from '@mui/material/';
import fileUploadImage from "../assets/BackgroundImages/folder-data.png";
import FolderIcon from '@mui/icons-material/Folder';
import TextField from '@mui/material/TextField';
import { Search } from '@mui/icons-material';
import ContentModels from './ContentModels';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';
import DotMenu from "../components/Chat/DotMenu"
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Tools/Loader';
import { ChatState } from '../Context/ChatProvider';

const FolderData = () => {
    const navigate=useNavigate()
    const [loading,setLoading]=useState(true);
    const [showSearchSmall,setShowSearchSmall]=useState(false)
    const { setPageNameContext,setCloseSideList } = ChatState();
    const colorsCode={
        a:'#ff7f47aa',
        b:'#fcaf45aa',
        c:'#808080aa',
        d:'#ff5e6caa',
        e:'#0171ceaa',
        f:'#25D366aa',
        g:'#ff8928aa',
        h:'#405de6aa',
        i:'#78c802aa',
        j:'#51d0deaa',
        k:'#ffc202aa',
        l:'#f13107aa',
        m:'#c0ff2daa',
        n:'#ffabb6aa',
        o:'#ffaaabaa',
        p:'#c89666aa',
        q:'#8076a3aa',
        r:'#a06919aa',
        s:'#00beffaa',
        t:'#ffcb00aa',
        u:'#9bc400aa',
        v:'#ec1f52aa',
        w:'#009338aa',
        x:'#f39308aa',
        y:'#39a0caaa',
        z:'#f95d9baa',
    }

    const style = {
        folderCreateMainBox: {
            minHeight: "500px", backgroundColor: "transparent",
        }
    }

    ////delete folder and aadd file in the folder
    /////// selected Folder Data
    const [folderSelect, setFolderSelect] = useState({});
    const ActionDelFolAndAddFile = (typeService = "", d = {}) => {
        if (typeService === "addFile") {
            setFolderSelect(d);
            modelOpens("AddFileModel");
        }
        if (typeService === "deleteFolder") {
            deleteFolder(d._id);
        }
        if (typeService === "ShowFilesInFolderModel") {
            setFolderSelect(d);
            modelOpens("ShowFilesInFolderModel");
        }
    };

    /////////deletaing folder
    //////// Delete Folder
    const deleteFolder = async (folderData) => {
        const UserId = localStorage.getItem("userInfo");
            const response = await axios.delete('api/v2/folder/deleteFolder',
                { data: { folderId: folderData} }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                const folderResponse = response.data;
                if (folderResponse.status) {
                    toast.success(folderResponse.message);
                    await getFoldersData(UserId);
                } else {
                    toast.error(folderResponse.message);
                }
            } else {
                toast.error("Something is wrong");
            }
    }



    ////Code for model open
    const [openNewModel, setOpenNewModel] = useState(false);
    const [show, setShow] = useState(false);
    const [NewModelOpen, setNewModelOpen] = useState(false);
    const [activeModel, setActiveModel] = useState("")
    ///// Model Open function like create channel
    const modelOpens = (modenOpenType) => {
        setOpenNewModel(true);/////this change the state in this page and then model show
        setShow(true);/////active model in diffrent page
        setActiveModel(modenOpenType);/////// which type of model active
        setNewModelOpen(true);////// Real dilog box open
    }

    /////////////// get the folder data here  /////
    const [folderDataStore, setFoldersData] = useState([]);
    const getFoldersData = async () => {
        setLoading(true)
        try {
            const response = await axios.get('api/v2/folder', {    
            headers: {
                    'Content-Type': 'application/json'
                }
            });
            const folderResponse = response.data;
            if (folderResponse.status==true) {
                const foldersData = folderResponse.data;
                setFoldersData(foldersData)
            } else {
                toast.error(folderResponse?.message);
            }
        } catch (error) {
            if (!error.response.data.status) {
                console.log(error?.response?.data?.message||"Get folder data not working");
                setFoldersData([])
            }

        }
        setLoading(false)
    }


    ///////// Search Folder code  Here
    const [srcFolderText, SetSrcFolderText] = useState("");
    const [debouncedSearchTerm] = useDebounce(srcFolderText, 500);
    useEffect(() => {
        if (debouncedSearchTerm !== "") {
            const searchingFiles = folderDataStore.filter((srcFolders) => srcFolders.folderName.toLowerCase().startsWith(debouncedSearchTerm.toLowerCase()));
            setFoldersData(searchingFiles);
        } else {
            getFoldersData();
        }

    }, [debouncedSearchTerm])


    //////////// calculate the folder size
    const folderSize = (data) => {
        if (data.length !== 0) {
            const folderFileSize = data.reduce((accumulator, currentValue) => {
                return accumulator + parseInt(currentValue.fileSize);
            }, 0);
            return `${Math.abs(parseInt(folderFileSize) / 1000000) % 1 !== 0 ?
                Math.abs(parseInt(folderFileSize) / 1000000).toFixed(2) :
                Math.floor(Math.abs(parseInt(folderFileSize) / 1000000))} MB`;

        } else {
            return 0;
        }
    }

    useEffect(() => {
        // setLoading(true)
        // getFilesOfUser();
        setPageNameContext("data")
        setCloseSideList(false)
    }, [])


    if(loading)
    {
        return(
            <Loader/>
        )
    }



    return (
        <>
            <Box px={{xs:'5px',sm:"20px"}} sx={style.folderCreateMainBox}>
                {folderDataStore.length === 0 &&
                    <Grid container>
                        <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                            <img src={fileUploadImage} style={{ width: "350px", userSelect: "none", pointerEvents: "none" }} alt="folder-creating-image" />
                        </Grid>
                        <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                            <Typography variant="subtitle1" fontWeight={"600"} >No folders added yet</Typography>
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
                                onClick={() => modelOpens("CreateFolder")}
                            >
                                Create Folders
                            </Button>
                        </Grid>

                    </Grid>
                }
                {folderDataStore?.length !== 0 &&
                    <Grid container px={1} >
                        <Grid container item mt={2} xs={12} >
                            <Box container width={"100%"} display={'flex'} justifyContent="space-between">
                                <Typography variant="h6" >Folders</Typography>
                                <Box >
                                    <TextField
                                        onClick={()=>setShowSearchSmall(true)}
                                        id="search_folder"
                                        placeholder='Search folder'
                                        size='small'
                                        sx={{
                                            width:{xs:showSearchSmall?"150px":'50px',sm:'140px',md:'180px',xl:'220px'},
                                            marginRight: "10px", "& input": {
                                                paddingTop: "7px",
                                                paddingBottom: "7px", fontSize: "14px",
                                            },
                                            paddingLeft: "4px", "& fieldset": { borderRadius: "8px" }
                                        }}
                                        value={srcFolderText}
                                        onChange={(e) => SetSrcFolderText(e.target.value)}
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
                                        sx={{ padding:{xs: "4px 15px",md:"5px 20px"},textTransform:'capitalize' }}
                                        onClick={() => modelOpens("CreateFolder")}
                                    >
                                        Create Folder
                                    </Button>
                                </Box>

                            </Box>
                        </Grid>
                        <Grid container item mt={3} xs={12} display={'flex'} flexWrap={'wrap'}>
                            {folderDataStore?.map((d, index) =>
                                <Box
                                marginX={{xs:"5px",sm:"3px",md:"25px"}}
                                    my={"10px"}
                                    sx={{
                                        width: {xs:"100px",sm:'155px',md:"170px"},
                                        height: {xs:"150px",sm:'170px',md:"180px"},
                                        padding: "5px 5px",
                                        boxSizing: "border-box",
                                        border: "0.5px solid #CBCBCB", borderRadius: "8px"
                                    }}
                                    key={`folder_${index}_ids`}
                                >
                                    <Box container display={'flex'} justifyContent="end"
                                    >
                                        <DotMenu handleDelete={deleteFolder} value={d._id} pageName='folder' handleAddFile={()=>ActionDelFolAndAddFile("addFile",d)}/>
                                        

                                    </Box>
                                    <Box container display={'flex'} justifyContent="center"> 
                                        <FolderIcon
                                            sx={{
                                                fontSize:{xs:'55px',sm:'80px'},
                                                color: colorsCode[d.folderName.slice(0,1).toLowerCase()]||"red"
                                                ,
                                                cursor: "pointer"
                                            }}
                                            onClick={() =>{d.filesList.length>0?navigate(`/files/folder/${d._id}`): toast.info("Files not added yet");}}
                                            />
                                    </Box>
                                    <Box container>
                                        <Typography align='center' variant="subtitle2" color={"#121212"} fontSize={{xs:"0.79rem",sm:"0.875rem"}}>{d.folderName}</Typography>
                                    </Box>
                                    <Box container>
                                        <Typography align='center' variant="subtitle2" fontSize={{xs:"10px",sm:"13px"}} color={"#CDCDCD"}>{folderSize(d.filesList)}</Typography>
                                    </Box>
                                </Box>
                            )}

                        </Grid>
                    </Grid>
                }
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
                    getFoldersData={getFoldersData}
                    folderSelect={folderSelect}////which folder silect that value store

                />
            }
        </>
    )
}

export default FolderData
