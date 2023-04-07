import { Box, Grid, Typography, TextField, Button } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { getCompanyName, postCompannyName } from '../api/InternalApi/OurDevApi';

import organaiseLogo from "../assets/Logo/organaise-logo.png";
import InviteSkipModal from '../components/InviteSkipModal/InviteSkipModal';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
const InviteTeam = () => {

    const [userId, setUserID] = useState("")
    
        const steps = [
            'Company Name',
            'Invite Team',
            'Project Name',
        ];

    const [companyName, setCompanyName] = useState("");
    /////// get Company data
    const getComFun = async (subUserId) => {
        try {
            const responseGetCom = await getCompanyName(subUserId);
            if (responseGetCom.status) {
                if (responseGetCom.data.length > 0) {
                    window.location.href = "/"
                }
            } else {
                toast.error(responseGetCom.message);
            }
        } catch (error) {
            console.log(error.response.message);
        }
    }

    // useEffect(() => {
    //     const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
    //     setUserID(UserId);
    // }, [])

    // useEffect(() => {
    //     if (userId !== "") {
    //         getComFun(userId);
    //     }
    // }, [userId])





    /////// Create company function call
    const createCompany = async () => {
        if ((companyName.trim() === "") || (companyName.length === 0)) {
            toast.info("Please enter company name");
            return;
        }
        const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
        try {
            const response = await postCompannyName({ userId: UserId, companyName: companyName })
            if (response.status) {
                toast.success(response.message);
                setTimeout(() => {
                    window.location = "/";
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
                        <Box sx={{ width: '100%' }}>
                            <Stepper activeStep={1} alternativeLabel>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>

                        <Box container mt={2} width={"100%"}>
                            <Typography fontSize={"30px"} textAlign={'center'} variant="h4" fontWeight={"600"}>Please invite new team members
                                via email</Typography>
                        </Box>
                        <Box container mt={2} width={"100%"}>
                            <Typography textAlign={'center'} fontWeight={"200"} fontSize='13px'>Add email address of team members
                            </Typography>
                        </Box>
                        <Box container mt={4} width={"100%"} display="flex" justifyContent={"center"}>
                            <TextField
                                id="company_name_here"
                                label="Eg. olivia@gmail.com"
                                placeholder='Eg. olivia@gmail.com'
                                sx={{ width: "75%"}}
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
                                Next
                            </Button>
                        </Box>

                        <Box container mt={4} width={"100%"} display="flex" justifyContent={"center"}>
                            <Button
                                variant='text'
                                sx={{ width: "75%", paddingTop: "10px", paddingBottom: "10pxsss" }}
                                // onClick={() => createCompany()}
                            >
                               < InviteSkipModal/>
                            </Button>
                        </Box>
                    </Grid>
                    <Grid container item display={{ xs: "none", md: "block" }} md={3} ></Grid>
                </Grid>
            </Box>
        </>
    )
}

export default InviteTeam