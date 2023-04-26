import { Box, Grid, Typography, TextField, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { getCompanyName, postCompannyName } from '../api/InternalApi/OurDevApi';
import { useNavigate } from "react-router-dom"
import { ChatState } from '../Context/ChatProvider';

import organaiseLogo from "../assets/Logo/organaise-logo.png";

const CompanyDetails = () => {
    const steps = [
        'Company Name',
        'Invite Team',
        'Project Name',
    ];
    const navigate = useNavigate()
    const [userId, setUserID] = useState("")
    const {setCloseAppDrawer,setCompNameContext,compNameContext}=ChatState()


    const [companyName, setCompanyName] = useState("");
    const getComFun = async () => {
        if(compNameContext)
        {
            navigate("/chat")
        }
        try {
            const responseGetCom = await getCompanyName(userId);  
            if (responseGetCom.status===true) {
                if (responseGetCom.data.length > 0) {
                    localStorage.setItem("sub",responseGetCom?.data[0]?.companyName)
                    setCloseAppDrawer(false)
                    setCompNameContext(companyName)
                    navigate("/chat")
                }
            } else {
                toast.error(responseGetCom?.message||"Company name is not set");
            }
        } catch (error) {
            console.log(error?.response?.message||"Something is wrong");
        }
    }

    useEffect(() => {
        const userId = localStorage.getItem("userInfo");
        setUserID(userId);
        setCloseAppDrawer(true)
        getComFun();
    }, [])






    /////// Create company function call
    const createCompany = async () => {
        if ((companyName.trim() === "") || (companyName.length === 0)) {
            toast.info("Please enter company name");
            return;
        }
        // const UserId = JSON.parse(localStorage.getItem("userId"));
        try {
            const response = await postCompannyName({ companyName: companyName })
            if (response.status) {
                toast.success(response.message);
                setTimeout(() => {
                    localStorage.setItem("sub",companyName)
                    setCompNameContext(companyName)
                    navigate("/chat")
                    setCloseAppDrawer(false)
                }, [500])
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.message);
        }

    }

    return (
        <>
            <Box container sx={{ width: "100%", minHeight: "600px", backgroundColor: "#ffffff" }}>
                <Grid container >
                    <Grid id="logoPartHere" mt={7} container item sx={12}>
                        <Box pl={{ xs: "1%", md: "10%" }}>
                            <img src={organaiseLogo} style={{ width: "150px" }} alt="organaise-logo-login-page" />
                        </Box>
                    </Grid>
                </Grid>
                <Grid container mt={7}>
                    <Grid container display={{ xs: "none", md: "block" }} md={3} item></Grid>
                    <Grid container item xs={12} md={6} >
                        {/* <Box sx={{ width: '100%' }}>
                            <Stepper activeStep={0} alternativeLabel>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box> */}

                        <Box container mt={2} width={"100%"}>
                            <Typography textAlign={'center'} variant="h4" fontWeight={"600"}>Please enter your Company name</Typography>
                        </Box>
                        <Box container mt={2} width={"100%"}>
                            <Typography textAlign={'center'} variant="subtitle1" fontWeight={"600"}>
                                This will be the name of your workspace
                            </Typography>
                        </Box>
                        <Box container mt={4} width={"100%"} display="flex" justifyContent={"center"}>
                            <TextField
                                id="company_name_here"
                                label="Company name"
                                placeholder='Please enter company name'
                                size='medium'
                                sx={{ width: "75%" }}
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </Box>
                        <Box container mt={4} width={"100%"} display="flex" justifyContent={"center"}>
                            <Button
                                variant='contained'
                                sx={{ width: "75%", paddingTop: "10px", paddingBottom: "10pxsss" }}
                                onClick={() => createCompany()}
                            >
                                Create company
                            </Button>
                        </Box>
                    </Grid>
                    <Grid container item display={{ xs: "none", md: "block" }} md={3} ></Grid>
                </Grid>
            </Box>
        </>
    )
}

export default CompanyDetails