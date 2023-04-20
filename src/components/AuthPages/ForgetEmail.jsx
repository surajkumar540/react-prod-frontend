import {
    Box, Grid, Typography, TextField,
    Button, InputAdornment, IconButton,
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react'
import organaiseLogo from "../../assets/Logo/organaise-logo.png";
import forgetPassPageBGImg from "../../assets/BackgroundImages/forgetPasswordBgImg.png"
import { toast } from 'react-toastify';
import { Visibility, VisibilityOff } from '@mui/icons-material';

/////Import react query functions
import { useMutation } from 'react-query'
// import {
//     CognitoSignUp,
//     otpWithResetPassword, resetPasswordFun
// } from "../../api/CognitoApi/CognitoApi";
import { getStartedVerify, ForgetEmailOtp } from '../../api/InternalApi/OurDevApi';
import { ServiceState } from '../../Context/ServiceProvider';
import { useNavigate, Link } from 'react-router-dom';
const cssStyle = {
    parent_box: {
        width: "100%",
        maxWidth: "1200px",
        height: "100vh"
    },
    content_container_box: {
        backgroundColor: "#ffffff",
        // padding: "10% 20%",
        padding: "10% 10%",
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

const ForgetEmail = () => {
    /////Store email address
    const [emailAddress, setEmailAddress] = useState("");
    /////// btn disabled until operation  not completed
    const [btnDisabed, setBtnDisabled] = useState(false);
    const [verifyBtnDisable, setVerifyBtnDisabled] = useState(false);

    const { serviceType, setSeviceType, setContextEmail, setContextOtp } = ServiceState();
    const navigate = useNavigate();
    const { mutateAsync: checkUserApi, isLoading: checkUserIsLoading } = useMutation(getStartedVerify);
    const { mutateAsync: ForgetEmailApi, isLoading: ForgetEmailOtpIsLoading } = useMutation(ForgetEmailOtp);

    const forgetOtpInMail = async (email) => {
        try {
            const checkResponse = await checkUserApi({ email: emailAddress })
            if (checkResponse.status) {
                const response = await ForgetEmailApi({ email });
                if (response.statusCode == 200) {
                    toast.info("Otp send in your mail please check your mail inbox.");
                    setSeviceType('forgetPassword');
                    setContextEmail(emailAddress);
                    navigate("/forget-password")
                } else {
                    toast.error(response?.error?.message || "Something wrong in forget email");
                }
            } else {
                toast.error("User not exist");
                return;
            }
        } catch (error) {

        }


    }


    const buttonAction = async () => {

        if (emailAddress === "") {
            toast.error("Please fill email.")
            return null;
        }

        forgetOtpInMail(emailAddress);
    }



    return (
        <Box container  >
            <Grid container padding={{ xs: 1, sm: 5 }}>
                {/* grid1 */}
                <Grid item xs={12} >
                    <Box container display={{ xs: 'start', sm: 'flex' }} >
                        <Grid item xs={6} sm={10} paddingLeft={{ xs: 2, sm: 12 }}>
                            <img
                                src={organaiseLogo}
                                style={{ width: "150px" }}
                                alt="organaise-logo-login-page" />
                        </Grid>
                        <Grid item xs={12} sm={8} display='flex' justifyContent={{ xs: 'center', sm: 'start' }}  >
                            <Typography variant="h4" fontSize={{ xs: '30px', sm: '33px', md: '40px' }} fontWeight='600' color="#333333" marginY={{ xs: 3, sm: 0 }}>
                                Forget Password
                            </Typography>
                        </Grid>
                    </Box>
                </Grid>

                {/* Grid2 */}
                <Grid item xs={12} sm={12} md={12} display='flex' justifyContent='center'  >
                    <Grid container xs={12} display='flex' >

                        <Grid item xs={12} sm={6} paddingBottom={2} >

                            <Box paddingLeft={4} display='flex' justifyContent='center'>
                                <img src={forgetPassPageBGImg} style={{ width: "57%" }}

                                    alt="forget-password-page-background-image" />
                            </Box>
                        </Grid>


                        <Grid item xs={12} sm={6} sx={cssStyle.grid_textBox_button} display='flex' justifyContent='center' >
                            <Grid item xs={11} sm={10} md={9} >
                                <Box marginY={2} >
                                    <TextField
                                        id="login-signup-forgetPassword-email"
                                        label="Email"
                                        variant='outlined'
                                        type="email"
                                        sx={cssStyle.btn_textfield}
                                        value={emailAddress ? emailAddress : ""}
                                        onChange={(e) => setEmailAddress(e?.target?.value)}
                                    />
                                </Box>


                                <Grid item xs={12} sx={cssStyle.grid_textBox_button} >
                                    <Button
                                        variant="contained"
                                        sx={{
                                            ...cssStyle.btn_textfield,
                                            height: "50px", position: "relative",
                                            backgroundColor: "primary",
                                            '&:hover': {
                                                backgroundColor: '#1c529b' // background color on hover
                                            }
                                        }}
                                        disabled={ForgetEmailOtpIsLoading || checkUserIsLoading}
                                        onClick={() => buttonAction()}

                                    >
                                        {(ForgetEmailOtpIsLoading) && (
                                            <CircularProgress
                                                size={24}
                                                style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    right: '3%',
                                                    marginTop: -12,
                                                    marginLeft: -12,
                                                    color: "primary"
                                                }}
                                            />
                                        )}

                                        Send OTP

                                    </Button>
                                    <Typography marginTop={2} variant="subtitle2" align='center'>
                                        I want to login so &nbsp;<Link to="/login">
                                            Click Here
                                        </Link>
                                    </Typography>
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ForgetEmail;