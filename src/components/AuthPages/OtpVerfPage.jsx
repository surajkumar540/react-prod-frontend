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
import { ServiceState } from '../../Context/ServiceProvider';
import {useNavigate} from "react-router-dom"

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

const OtpVerfPage = () => {
    const navigate=useNavigate()
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
    const { serviceType, contextEmail, contextPassword } = ServiceState();
    const [password, setPassword] = useState(contextPassword);
    console.log()
    const [confirmPassword, setConfirmPassword] = useState("");
    /////// btn disabled until operation  not completed
    const [btnDisabed, setBtnDisabled] = useState(false);
    /////// Verify button disaabled until operation not complete
    const [verifyBtnDisable, setVerifyBtnDisabled] = useState(false);
    console.log(serviceType, contextEmail, 'tfs');

    ////////Here we are write the calling api react query function and call the login fuction and resend  confermation mail
    const { mutateAsync: loginApiCall } = useMutation(userSignIn);
    const { mutateAsync: loginV1 } = useMutation(userLoginAccount);
    const { mutateAsync: resendVerificationMail } = useMutation(resendConfermationEMail);


    ///////// Signup otp verification/////////
    const { mutateAsync: SignUpOtpVerification } = useMutation(SignUpOtpVarify);
    const signupVerificationOtp = async (email, getOtp) => {
        console.log(email, 'email');
        console.log(getOtp, "getOtp");
        setVerifyBtnDisabled(true);
        const userName = email.split('@')[0];
        console.log(userName, 'usrname');
        const otpResponse = await SignUpOtpVerification({ username: userName, userOtp: getOtp });
        console.log(otpResponse, '1')
        if (otpResponse.status) {
            const response = await loginApiCall({ username: userName, password: password });
            console.log(password, 'pASSWORD ')
            console.log(response, '2 ')
            if (response.status) {
                toast.success("OTP verified successfully.Please wait we are setup your account.");
                setTimeout(async () => {
                    localStorage.clear();
                    const AgainLoginresponse = await loginApiCall({ username: userName, password: password });
                    if (AgainLoginresponse.status) {
                        userLoginV1(email, password);
                        setVerifyBtnDisabled(false)
                        setTimeout(() => {
                            // window.location = "/companyDetail";
                            navigate("/companyDetail")
                        }, [1000])
                    }
                }, [1000])
            }
        } else {
            toast.error(otpResponse.error.message);
            console.log('els condition running')
            setVerifyBtnDisabled(false);
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
    ///////// resend otp 
    const { mutateAsync: resetPasswordFunCall, isLoading: resetPasswordIsLoading } = useMutation(resetPasswordFun);
    const resendOtpInMail = async (email) => {
        console.log(email, '1')
        const response = await resetPasswordFunCall({ username: email.split("@")[0] });
        console.log(response, 'resp1');
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
        console.log(email, GetOtp, newPassword, 'email, getop');
        setVerifyBtnDisabled(true)
        let userName = email.split('@')[0]
        const updatePassword = await updatePasswordWithOtp({ username: userName, otp: GetOtp, password: newPassword });
        console.log(updatePassword, '2');
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
        // setPassword("");
        setConfirmPassword("");
    }, [serviceType])


    const otpVerifyBtn = async (serviceType) => {
        if ((OtpValue === "") || (OtpValue.length !== 6)) {
            toast.error("Please enter six digit OTP.");
            return null;
        }
        if (serviceType === "login") {
            await signupVerificationOtp(contextEmail, OtpValue, contextPassword);
        }

        if (serviceType === "signup") {
            await signupVerificationOtp(contextEmail, OtpValue, contextPassword);
        }

        if (serviceType === "forgetPassword") {
            updateNewPassword(contextEmail, OtpValue, contextPassword)
        }
    }



    return (
        <Box container display='flex' aligItems='center' height='100vh' >
            <Grid container padding={7} >
                <Grid item xs={12} sm={12} md={6} height='100%'>
                    <Box container display='flex' flexDirection='column' height='80%'>
                        <Box paddingLeft={4}>
                            <img
                                src={organaiseLogo}
                                style={{ width: "150px" }}
                                alt="organaise-logo-login-page" />
                        </Box>
                        <Box paddingLeft={4}>
                            <img src={otpVerificationBgImg} style={{ width: "100%" }} alt="login-page-background-image" />
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={12} md={6} display={'flex'} justifyContent={'center'}    >
                    <Box width='70%' height='80%'  >
                        <Grid item xs={12}  >
                            <Typography variant="h4" textAlign='center' fontWeight='600' color="#333333">
                                OTP Verification
                            </Typography>
                            <Typography variant="subtitle1" fontWeight='600' textAlign='center' color="#333333">
                                We’ve sent a code to {contextEmail}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid item xs={12} sx={cssStyle.grid_textBox_button} display='flex' justifyContent='center' paddingY={1}>
                                <OtpField
                                    value={OtpValue}
                                    onChange={setOtpValue}
                                    numInputs={6}
                                    onChangeRegex={/^([0-9]{0,})$/}
                                    autoFocus
                                    // separator={<span>-</span>}
                                    isTypeNumber
                                    inputProps={{
                                        className: `otp-field__input`,
                                        disabled: false,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sx={cssStyle.grid_textBox_button} paddingY={3} display='flex' justifyContent='center' alignItems='center'>
                                <Typography variant="subtitle1" align='center' fontWeight='400' color="#333333">
                                    Didn’t receive OTP?
                                    {
                                        console.log(contextEmail, 'otpMail')
                                    }
                                </Typography>
                                <Button onClick={() => resendOtpInMail(contextEmail)} style={{ fontWeight: 700, color: "#1c529b" }}>
                                    Resend
                                </Button>
                            </Grid>
                            <Grid item xs={12} >
                                <Button variant="contained"
                                    sx={{
                                        ...cssStyle.btn_textfield,
                                        height: "50px", position: "relative",
                                        backgroundColor: "primary",
                                        '&:hover': {
                                            backgroundColor: '#1c529b' // background color on hover
                                        }
                                    }}
                                    disabled={verifyBtnDisable}
                                    onClick={() => otpVerifyBtn(serviceType)}
                                >

                                    {verifyBtnDisable && (
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
                                    )}
                                    Verify OTP
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default OtpVerfPage