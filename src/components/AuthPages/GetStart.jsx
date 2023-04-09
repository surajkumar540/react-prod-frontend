import {
    Box, Grid, Typography, TextField,
    Button, IconButton, InputAdornment
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react'
import organaiseLogo from "../../assets/Logo/organaise-logo.png";
import loginPageBackgroundImg from "../../assets/BackgroundImages/loginBackGroundImg.png"
import forgetPassPageBGImg from "../../assets/BackgroundImages/forgetPasswordBgImg.png"
import signupPageBgImg from "../../assets/BackgroundImages/signupBackgroundImg.png"
import otpVerificationBgImg from "../../assets/BackgroundImages/otpVerificationBgImg.png"
import { Link } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import OtpField from 'react-otp-field';
import { toast } from 'react-toastify';
/////Import react query functions
import { useMutation } from 'react-query'
import {
    userSignIn, resendConfermationEMail,
    CognitoSignUp, SignUpOtpVarify,
    otpWithResetPassword, resetPasswordFun
} from "../../api/CognitoApi/CognitoApi";
import { passwordValidator } from '../../utils/validation';
import { userCreateAccount, userLoginAccount } from '../../api/InternalApi/OurDevApi';
import checkboxIcon from '../../assets/BackgroundImages/checkbox.png'
import GoogleIcon from '../../assets/svg/Google.svg'
import FacebookIcon from '../../assets/svg/Facebook.svg'
import AppleIcon from '../../assets/svg/Apple.svg'
import { List, ListItem, ListItemText } from '@mui/material';

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

const GetStart = ({ serviceType }) => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPass, setShowConfPass] = useState(false);
    const [OtpValue, setOtpValue] = useState('');////otp value store here
    const [showOtpVeriCont, setShowVeriCon] = useState(false);
    /////Store email address
    const [fullName, setFullName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    /////// btn disabled until operation  not completed
    const [btnDisabed, setBtnDisabled] = useState(false);
    /////// Verify button disaabled until operation not complete
    const [verifyBtnDisable, setVerifyBtnDisabled] = useState(false);


    ////////Here we are write the calling api react query function and call the login fuction and resend  confermation mail
    const { mutateAsync: loginApiCall } = useMutation(userSignIn);
    const { mutateAsync: loginV1 } = useMutation(userLoginAccount);
    const { mutateAsync: resendVerificationMail } = useMutation(resendConfermationEMail);
    const loginAccount = async (email, password) => {
        setBtnDisabled(true);
        const response = await loginApiCall({ username: email.split("@")[0], password: password });
        if (response.status) {
            toast.success("Login successfully");
            userLoginV1(email, password);
            setTimeout(() => {
                setBtnDisabled(false);/////login , signup ,forget account btn disaabled after clicking
                window.location = "/";
            }, [1500])
        } else {
            ////////user account created but user account not activated//////
            if (response.error.message === "User is not confirmed.") {
                setShowVeriCon(true);
                const mailApiRes = await resendVerificationMail({ username: email.split("@")[0] });
                if (mailApiRes.status) {
                    toast.info("Please check your mail inbox.");
                    setBtnDisabled(false);
                } else {
                    toast.error(mailApiRes.error.message);
                    setBtnDisabled(false);
                }
            } else {
                setBtnDisabled(false)
                toast.error(response.error.message);
            }
        }
    }

    ///////// when click on the signup button then code run 
    const { mutateAsync: SignUpFunCall, isLoading: isLoadingSignUpFun } = useMutation(CognitoSignUp);
    const { mutateAsync: SignUpFunCallV1, isLoading: isLoadingSignUpFunV1 } = useMutation(userCreateAccount);
    const createAccount = async (name, email, password) => {
        const userName = email.split('@')[0];
        const userEmail = email;
        const userPassword = password;
        const response = await SignUpFunCall({ username: userName, email: userEmail, password: userPassword })
        if (response.status && response.data.userSub) {
            toast.info("Please check your inbox");
            await userInsertv1(name, email, password);
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

    const userLoginV1 = async (email, password) => {
        try {
            const response = await loginV1({ email, password });
            if (response.status) {
                localStorage.setItem("userInfo", JSON.stringify(response))
            } else {
                console.log("User not login in v1");
            }

        } catch (error) {
            console.log(error.response.data.message);
        }

    }

    ///////// Signup otp verification/////////
    const { mutateAsync: SignUpOtpVerification } = useMutation(SignUpOtpVarify);
    const signupVerificationOtp = async (email, getOtp) => {
        setVerifyBtnDisabled(true);
        const userName = email.split('@')[0];
        const otpResponse = await SignUpOtpVerification({ username: userName, userOtp: getOtp });
        if (otpResponse.status) {
            const response = await loginApiCall({ username: userName, password: password });
            if (response.status) {
                toast.success("OTP verified successfully.Please wait we are setup your account.");
                setTimeout(async () => {
                    localStorage.clear();
                    const AgainLoginresponse = await loginApiCall({ username: userName, password: password });
                    if (AgainLoginresponse.status) {
                        userLoginV1(email, password);
                        setVerifyBtnDisabled(false)
                        setTimeout(() => {
                            window.location = "/companyDetail";
                        }, [1000])
                    }
                }, [1000])
            }
        } else {
            toast.error(otpResponse.error.message);
            setVerifyBtnDisabled(false);
        }
    }

    ///////// resend otp 
    const { mutateAsync: resetPasswordFunCall, isLoading: resetPasswordIsLoading } = useMutation(resetPasswordFun);
    const resendOtpInMail = async (email) => {
        const response = await resetPasswordFunCall({ username: email.split("@")[0] });
        if (response.status) {
            toast.info("Otp send in your mail please check your mail inbox.");
            setShowVeriCon(true);
        } else {
            toast.error(response.error.message);
        }
    }


    //////// change password api call or Reset password code here when user in forget passsword page 
    const { mutateAsync: updatePasswordWithOtp } = useMutation(otpWithResetPassword);
    const updateNewPassword = async (email, GetOtp, newPassword) => {
        setVerifyBtnDisabled(true)
        let userName = email.split('@')[0]
        const updatePassword = await updatePasswordWithOtp({ username: userName, otp: GetOtp, password: newPassword });
        if (updatePassword.status) {
            toast.success("Password update successfullly.Please wait we are redirect in login page.");
            setTimeout(() => {
                setVerifyBtnDisabled(false)
                window.location = "/login";
            }, [3000])
        } else {
            toast.error(updatePassword.error.message);
            setVerifyBtnDisabled(false)
        }
    }

    ///////Service type  change then useEffect Run
    useEffect(() => {
        // setFullName("");
        setFirstName("");
        setLastName("")
        setEmailAddress("");
        setPassword("");
        setConfirmPassword("");
    }, [serviceType])

    /////////// when clickk on the button Like -  login , signup , forget password
    const buttonAction = async (serviceType) => {
        if (serviceType === "login") {
            if (emailAddress === "" || password === "") {
                toast.error("Please fill all fields.")
                return null;
            }
            loginAccount(emailAddress, password);
        }

        if (serviceType === "signup") {
            if (firstName === "" || lastName === "" || emailAddress === "" || password === "" || confirmPassword === "") {
                toast.error("Please fill all fields.")
                return null;
            }
            if (password !== confirmPassword) {
                toast.error("Password and confirm password not matched.")
                return null;
            }
            if (!passwordValidator(password) || !passwordValidator(confirmPassword)) {
                return null;
            }
            await createAccount(firstName, lastName, emailAddress, password);
            // await createAccount(firstName, lastName, emailAddress, password);
        }

        if (serviceType === "forgetPassword") {
            if (emailAddress === "" || password === "" || confirmPassword === "") {
                toast.error("Please fill all fields.")
                return null;
            }
            if (password != confirmPassword) {
                toast.error("Password and confirm password not matched.")
                return null;
            }
            resendOtpInMail(emailAddress);
        }

    }

    ////////// When click on the verify button
    const otpVerifyBtn = async (serviceType) => {
        if ((OtpValue === "") || (OtpValue.length !== 6)) {
            toast.error("Please enter six digit OTP.");
            return null;
        }
        if (serviceType === "login") {
            await signupVerificationOtp(emailAddress, OtpValue);
        }

        if (serviceType === "signup") {
            await signupVerificationOtp(emailAddress, OtpValue);
        }

        if (serviceType === "forgetPassword") {
            updateNewPassword(emailAddress, OtpValue, password)
        }
    }

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfPassword = () => {
        setShowConfPass(!showConfPass);
    }


    return (
        <Box container display='flex' aligItems='center' height='100vh' >
            <Grid container padding={7}>
                <Grid item xs={12} sm={12} md={6}  height='100%'>
                    <Box container  display='flex' flexDirection='column' height='80%'>
                        <Box paddingLeft={4} >
                            <img
                                src={organaiseLogo}
                                style={{ width: "150px" }}
                                alt="organaise-logo-login-page" />
                        </Box>
                        <Box paddingLeft={4} height='60%'>
                            <img src={loginPageBackgroundImg} style={{ height: "100%" }} alt="login-page-background-image" />
                        </Box>

                        <Grid xs={8} >

                            <Box  sx={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} paddingX={2} paddingY={1} borderRadius={4}  >
                                <Typography variant='h5' paddingBottom={1} textAlign='center' fontWeight='bold' fontSize='20px'>Discover what sets us apart
                                </Typography>
                   
                                <Box display='flex' flexDirection='column' justifyContent='center' >
                                    <Box display='flex' alignItems='center' gap={2} padding={1}>
                                        <img src={checkboxIcon} />
                                        <Typography >Profile Creation</Typography>
                                    </Box>
                                    <Box display='flex' alignItems='center' gap={2} padding={1}>
                                        <img src={checkboxIcon} />
                                        <Typography >Social Networking</Typography>
                                    </Box>
                                    <Box display='flex' alignItems='center' gap={2} padding={1}>
                                        <img src={checkboxIcon} />
                                        <Typography >Media Sharing</Typography>
                                    </Box>
                                    <Box display='flex' alignItems='center' gap={2} padding={1}>
                                        <img src={checkboxIcon} />
                                        <Typography >Groups and Communities</Typography>
                                    </Box>
                                    <Box display='flex' alignItems='center' gap={2} padding={1}>
                                        <img src={checkboxIcon} />
                                        <Typography >Privacy Controls</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={12} md={6} display={'flex'} justifyContent={'center'}  >
                    <Box width='70%' height='80%' display='flex' flexDirection='column'  justifyContent='center'  >
                        <Grid item xs={12}   >
                            <Box>
                                <Typography variant="h4" fontWeight='600' color="#333333">
                                    Get Started
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sx={cssStyle.grid_textBox_button} >
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
                                disabled={btnDisabed || isLoadingSignUpFun}
                                onClick={() => buttonAction(serviceType)}

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

                                Continue

                            </Button>

                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='center' alignItems='center' gap={2}>
                            <Box height='1px' width='45%' backgroundColor='gray' />
                            <Typography>OR</Typography>
                            <Box height='1px' width='45%' backgroundColor='gray' />
                        </Grid>

                        <Grid item xs={12} >
                            <Box marginTop={3} sx={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} borderRadius={2}>
                                <Box display='flex' justifyContent='center' alignItems='center' gap={2} padding={1}>
                                    <img src={GoogleIcon} />
                                    <Typography fontWeight='bold' >Continue with Google</Typography>
                                </Box>
                            </Box>

                            <Box marginTop={3} sx={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} borderRadius={2}>
                                <Box display='flex' justifyContent='center' alignItems='center' gap={2} padding={1}>
                                    <img src={FacebookIcon} />
                                    <Typography fontWeight='bold' textAlign='center'>Continue with Facebook</Typography>
                                </Box>
                            </Box>

                            <Box marginTop={3} sx={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} borderRadius={2}>
                                <Box display='flex' justifyContent='center' alignItems='center' gap={2} padding={1}>
                                    <img src={AppleIcon} />
                                    <Typography fontWeight='bold' textAlign='center'>Continue with Apple</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box >
    )
}

export default GetStart