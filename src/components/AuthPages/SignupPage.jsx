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
import { Link, useNavigate } from 'react-router-dom';
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
import { ServiceState } from '../../Context/ServiceProvider';


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
        margin: "20% 0%",
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

export const SignupPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPass, setShowConfPass] = useState(false);
    const [OtpValue, setOtpValue] = useState('');////otp value store here
    const [showOtpVeriCont, setShowVeriCon] = useState(false);
    /////Store email address
    const { serviceType, setSeviceType } = ServiceState();
    const [fullName, setFullName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [btnDisabed, setBtnDisabled] = useState(false);
    const [verifyBtnDisable, setVerifyBtnDisabled] = useState(false);

    const navigate = useNavigate();

    const { mutateAsync: loginApiCall } = useMutation(userSignIn);
    const { mutateAsync: loginV1 } = useMutation(userLoginAccount);
    const { mutateAsync: SignUpFunCall, isLoading: isLoadingSignUpFun } = useMutation(CognitoSignUp);
    const { mutateAsync: SignUpFunCallV1, isLoading: isLoadingSignUpFunV1 } = useMutation(userCreateAccount);
    const createAccount = async (name, email, password) => {
        const userName = email.split('@')[0];
        const userEmail = email;
        const userPassword = password;
        // const userPhoneNo = phoneNumber;
        const response = await SignUpFunCall({ username: userName, email: userEmail, password: userPassword})
        if (response.status && response.data.userSub) {
            toast.info("Please check your inbox");
            setSeviceType('signup')
            navigate("/otpVerf")
            await userInsertv1(name, email, password);
        } else {
            toast.error(response.error.message);
        }

    }

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

    const buttonAction = async () => {
            // if (firstName === "" || lastName === "" || emailAddress === "" || password === "" || confirmPassword === "" || phoneNumber === "") {
        if (firstName === "" || lastName === "" || emailAddress === "" || password === "" || confirmPassword === "" ) {    
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
            await createAccount(firstName+lastName, emailAddress, password);
            // await createAccount(firstName, lastName, emailAddress, password);
       
    }

    ////////// When click on the verify button
    const otpVerifyBtn = async (serviceType) => {
        await signupVerificationOtp(emailAddress, OtpValue);
    }

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfPassword = () => {
        setShowConfPass(!showConfPass);
    }
    return (
        <Box container sx={cssStyle.parent_box}  >
            <Grid container >
                <Grid item xs={12} sm={12} md={8} >
                    <Box container sx={{ ...cssStyle.content_container_box, padding: "6% 5% 10% 20% !important" }}  >
                        <Box >
                            <img
                                src={organaiseLogo}
                                style={{ width: "150px" }}
                                alt="organaise-logo-login-page" />
                        </Box>
                        <Box >
                            <img src={signupPageBgImg} style={{ width: "80%" }} alt="signUp-page-background-image" />
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={4} >
                    <Box sx={cssStyle.box_container_form}>
                        <Grid container>
                            <Box display='flex' gap={2} >

                                <Grid item xs={6} sx={cssStyle.grid_textBox_button}>
                                    <TextField
                                        id="signup-name-user"
                                        label="First Name"
                                        variant='outlined'
                                        type="text"
                                        sx={cssStyle.btn_textfield}
                                        value={firstName ? firstName : ""}
                                    onChange={(e) => setFirstName(e?.target?.value)}
                                    />
                                </Grid>

                                <Grid item xs={6} sx={cssStyle.grid_textBox_button}>
                                    <TextField
                                        id="signup-name-user"
                                        label="Last Name"
                                        variant='outlined'
                                        type="text"
                                        sx={cssStyle.btn_textfield}
                                        value={lastName ? lastName : ""}
                                    onChange={(e) => setLastName(e?.target?.value)}
                                    />
                                </Grid>

                            </Box>

                            <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                                <TextField
                                    id="login-signup-forgetPassword-email"
                                    label="Phone Number"
                                    variant='outlined'
                                    type="number"
                                    sx={cssStyle.btn_textfield}
                                    value={phoneNumber ? phoneNumber : ""}
                                    onChange={(e) => setPhoneNumber(e?.target?.value)}
                                />
                            </Grid>
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
                                <TextField
                                    id="login-signup-forgetPassword-password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    variant='outlined'
                                    sx={cssStyle.btn_textfield}
                                    value={password ? password : ""}
                                    onChange={(e) => setPassword(e?.target?.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end"
                                                sx={{
                                                    display: password !== "" ? "contents" : "none"
                                                }}
                                            >
                                                {password.length > 2
                                                    ?
                                                    <IconButton onClick={handleTogglePassword}>
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                    : null
                                                }
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                               
                            </Grid>


                            <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                                <TextField
                                    id="login-signup-forgetPassword-confirm-password"
                                    label="Confirm Password"
                                    type={showConfPass ? 'text' : 'password'}
                                    variant='outlined'
                                    sx={cssStyle.btn_textfield}
                                    value={confirmPassword ? confirmPassword : ""}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end"
                                                sx={{
                                                    display: confirmPassword !== "" ? "contents" : "none"
                                                }}

                                            >
                                                {confirmPassword.length > 2
                                                    ?
                                                    <IconButton onClick={handleToggleConfPassword}>
                                                        {showConfPass ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                    : null
                                                }
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                               
                                    <Typography variant="subtitle2" align='center'>
                                        You have already Account so <Link to="/login">
                                            Click Here
                                        </Link>
                                    </Typography>

                            </Grid>

                        </Grid>

                        <Grid item xs={12} gap={2} >
                            <Typography fontWeight='bold' paddingBottom={1} >Password must have</Typography>
                            <Typography as='li' color='red'>At least 8 characters </Typography>
                            <Typography as='li' color='red'>At least 1 lestter (a,b,c...)</Typography>
                            <Typography as='li' color='red'>At least 1 number (1,2,3...)</Typography>
                            <Typography as='li' color='red'>Both uppercase & lowercase characters</Typography>
                        </Grid>

                        <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                            <Button
                                variant="contained"
                                sx={{
                                    ...cssStyle.btn_textfield,
                                    height: "50px", position: "relative",
                                    backgroundColor: "primary",
                                    '&:hover': {
                                        backgroundColor: '#1c529b' 
                                        // background color on hover
                                    }
                                }}
                                disabled={btnDisabed || isLoadingSignUpFun}
                                onClick={() => buttonAction()}

                            >
                               
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
                                Create Account
                            </Button>

                        </Grid>

                    </Box>
                </Grid>
            </Grid>
        </Box >
    )
}
