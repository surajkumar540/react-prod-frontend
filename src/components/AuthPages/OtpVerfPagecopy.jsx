import {Box, Grid, Typography, Button} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import React, { useState } from 'react'
import organaiseLogo from "../../assets/Logo/organaise-logo.png";
import otpVerificationBgImg from "../../assets/BackgroundImages/otpVerificationBgImg.png"
import OtpField from 'react-otp-field';

/////Import react query functions
import { useNavigate } from "react-router-dom"

const cssStyle = {
    parent_box: {
        width: "100%",
        maxWidth: "1200px",
        height: "100vh"
    },
    content_container_box: {
        backgroundColor: "#ffffff",
        padding: "10% 20%",
        minHeight: "500px",
        maxHeight: "100vh"
    },
    box_container_form: {
        margin: "1% 0%",
    },
    btn_textfield: {
        width: "100%",
        marginBottom: "5px",
        '& .MuiInputLabel-root': {
            color: '#1c529b', // default label color
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'primary' // default border color
            },
            '&:hover fieldset': {
                borderColor: 'primary' // border color on hover
            },
            '&.Mui-focused fieldset ': {
                borderColor: 'primary' // border color when focused
            },

        }
    },
    grid_textBox_button: {
        margin: "4px 0px"
    },
}

const OtpVerfPagecopy = () => {
    const navigate = useNavigate();


    return (
        <Box container  >
            <Grid container padding={{ xs: 1, sm: 5 }}>
                {/* grid1 */}
                <Grid item xs={12} sm={6} >
                    <Box container display={{ xs: 'flex', sm: 'center' }} flexDirection='column'>
                        <Grid item xs={12} sm={12} paddingLeft={{ xs: 2, sm: 12 }}  >
                            <img
                                src={organaiseLogo}
                                style={{ width: "150px" }}
                                alt="organaise-logo-login-page" />
                        </Grid>
                        <Grid item xs={12} sm={12}  display='flex' flexDirection='column' justifyContent={{ xs: 'center', sm: 'center' }} paddingLeft={{xs:'0%',sm:'3%'}}  >
                            <Typography variant="h4" textAlign={{xs:'center',md:'center'}} fontSize={{ xs: '26px', sm: '28px', md: '40px' }} fontWeight='200' color="#333333" marginY={{ xs: 1, sm: 0 }}>
                            OTP Verification
                            </Typography>
                              <Typography fontSize={{ xs: '14px', sm: '15px', md: '16px' }} textAlign={{xs:'center',md:'center'}} paddingY={{ xs: 1, sm: 0 }}>
                              We’ve sent a code to 
                            </Typography>
                        </Grid>
                    </Box>
                </Grid>


                {/* Grid2 */}
                <Grid item xs={12} sm={12} md={12} display={'flex'} justifyContent={'center'}  >

                    <Grid container xs={12} display='flex' justifyContent='center'>
                        <Grid item xs={12} sm={6} paddingBottom={2} >
                            <Box paddingLeft={4} display='flex' justifyContent='center' >

                                <img src={otpVerificationBgImg} style={{ width: "65%" }} alt="login-page-background-image" />
                            </Box>

                        </Grid>

                        <Grid item xs={11} sm={6}  display='flex' justifyContent='center' >
                            <Grid item xs={12} sm={12} md={10}>
                                <Grid item xs={12} sx={cssStyle.grid_textBox_button} display='flex' justifyContent='center' paddingTop={4} >
                                    <OtpField
                                        value={OtpValue}
                                        // onChange={setOtpValue}
                                        numInputs={6}
                                        onChangeRegex={/^([0-9]{0,})$/}
                                        autoFocus
                                        // separator={<span>-</span>}
                                        isTypeNumber
                                        inputProps={{
                                            className: `otp-field__input`,
                                            disabled: false,
                                            width:'600px'
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sx={cssStyle.grid_textBox_button} paddingY={2} display='flex' justifyContent='center' alignItems='center'>
                                    <Typography variant="subtitle1" align='center' fontWeight='400' color="#333333">
                                        Didn’t receive OTP?
                                        {/* {
                                        console.log(contextEmail, 'otpMail')
                                    } */}
                                    </Typography>
                                    <Button
                                        // onClick={() => resendOtpInMail(contextEmail)}
                                        style={{ fontWeight: 700, color: "#1c529b" }}>
                                        Resend
                                    </Button>
                                </Grid>
                                <Grid item xs={12}  sx={cssStyle.grid_textBox_button} >
                                    <Button  variant="contained"
                                        sx={{
                                            ...cssStyle.btn_textfield,
                                            height: "50px", position: "relative",
                                            backgroundColor: "primary",
                                            '&:hover': {
                                                backgroundColor: '#1c529b' // background color on hover
                                            }
                                        }}
                                    >

                                        <CircularProgress
                                            size={24}
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                right: '3%',
                                                marginTop: -12,
                                                marginLeft: -12,
                                                color: "#1c529b"
                                            }}
                                        />
                                        Verify OTP
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default OtpVerfPagecopy