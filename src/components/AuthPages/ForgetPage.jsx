import {
    Box, Grid, Typography, TextField,
    Button
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react'
import organaiseLogo from "../../assets/Logo/organaise-logo.png";
import forgetPassPageBGImg from "../../assets/BackgroundImages/forgetPasswordBgImg.png"
import { toast } from 'react-toastify';
/////Import react query functions
import { useMutation } from 'react-query'
import {
    CognitoSignUp,
    otpWithResetPassword, resetPasswordFun
} from "../../api/CognitoApi/CognitoApi";
import { userCreateAccount, userLoginAccount } from '../../api/InternalApi/OurDevApi';
import { ServiceState } from '../../Context/ServiceProvider';
import { useNavigate } from 'react-router-dom';
const cssStyle = {
    parent_box: {
        width: "100%",
        maxWidth: "1200px",
        height: "100vh"
    },
    content_container_box: {
        backgroundColor: "#ffffff",
        // padding: "10% 20%",
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

const ForgetPage = () => {


    const [showOtpVeriCont, setShowVeriCon] = useState(false);
    /////Store email address
    const [emailAddress, setEmailAddress] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    /////// btn disabled until operation  not completed
    const [btnDisabed, setBtnDisabled] = useState(false);
    /////// Verify button disaabled until operation not complete
    const [verifyBtnDisable, setVerifyBtnDisabled] = useState(false);

    const { serviceType, setSeviceType } = ServiceState();
    const navigate = useNavigate();
    const { mutateAsync: resetPasswordFunCall, isLoading: resetPasswordIsLoading } = useMutation(resetPasswordFun);
    const resendOtpInMail = async (email) => {
        const response = await resetPasswordFunCall({ username: email.split("@")[0] });
        if (response.status) {
            toast.info("Otp send in your mail please check your mail inbox.");
            setShowVeriCon(true);
            setSeviceType('forgetPassword');
            navigate("/otpVerf")
        } else {
            toast.error(response.error.message);
        }
    }

    const { mutateAsync: SignUpFunCall, isLoading: isLoadingSignUpFun } = useMutation(CognitoSignUp);
    const { mutateAsync: SignUpFunCallV1, isLoading: isLoadingSignUpFunV1 } = useMutation(userCreateAccount);
    const createAccount = async (name, email, password) => {
        const userName = email.split('@')[0];
        const userEmail = email;
        const userPassword = password;
        const response = await SignUpFunCall({ username: userName, email: userEmail, password: userPassword })
        if (response.status && response.data.userSub) {
            toast.info("Please check your inbox");
            await userInsertv1(email);
        } else {
            toast.error(response.error.message);
        }

    }

    const userInsertv1 = async (name, email, password) => {
        const createUserDetOject = { name, email, password };
        try {
            setShowVeriCon(true);
            const response = await SignUpFunCallV1(createUserDetOject);
            if (response.status) {
                console.log("data created in v1");
            }
        } catch (error) {
            console.log(error.response.data.message);
        }

    }

    const buttonAction = async () => {
    
            if (emailAddress === "") {
                toast.error("Please fill all fields.")
                return null;
            }
           
            resendOtpInMail(emailAddress);
    }



    return (
        <Box container sx={cssStyle.parent_box}  >
            <Grid container >
                <Grid item xs={12} sm={12} md={6} >
                    <Box container sx={{ ...cssStyle.content_container_box, padding: "6% 5% 10% 20% !important" }}  >
                        <Box >
                            <img
                                src={organaiseLogo}
                                style={{ width: "150px" }}
                                alt="organaise-logo-login-page" />
                        </Box>
                        <Box >
                            <img src={forgetPassPageBGImg} style={{ width: "100%" }} alt="forget-password-page-background-image" />
                        </Box>

                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    {!showOtpVeriCont &&
                        <Box container sx={cssStyle.content_container_box}  >
                            <Box>
                                <Typography variant="h4" fontWeight='600' color="#333333">

                                    Forget Password
                                </Typography>
                            </Box>
                            <Box sx={cssStyle.box_container_form}>
                                <Grid container>

                                    <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                                        <TextField
                                            id="login-signup-forgetPassword-email"
                                            label="Email"
                                            variant='outlined'
                                            type="email"
                                            sx={cssStyle.btn_textfield}
                                            value={emailAddress ? emailAddress : ""}
                                            onChange={(e) => setEmailAddress(e?.target?.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
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
                                            disabled={btnDisabed || isLoadingSignUpFun}
                                            onClick={() => buttonAction()}

                                        >
                                            {(btnDisabed || isLoadingSignUpFun) && (
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

                                    </Grid>


                                </Grid>
                            
                            </Box>
                        </Box>
                    }

                </Grid>
            </Grid>
        </Box>
    )
}

export default ForgetPage