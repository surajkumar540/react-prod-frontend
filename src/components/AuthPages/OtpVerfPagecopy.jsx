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
// import {
//     userSignIn, resendConfermationEMail,
//     CognitoSignUp, SignUpOtpVarify,
//     otpWithResetPassword, resetPasswordFun
// } from "../../api/CognitoApi/CognitoApi";
import { passwordValidator } from '../../utils/validation';
import { userLoginAccount, otpSignUpVerify } from '../../api/InternalApi/OurDevApi';
import { ServiceState } from '../../Context/ServiceProvider';
import { useNavigate } from "react-router-dom"

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

const OtpVerfPage = ({ setIsAuthenticated }) => {
    const navigate = useNavigate()
    const { serviceType, contextEmail, contextPassword, contextName } = ServiceState();
    const [OtpValue, setOtpValue] = useState('');////otp value store here
    const [showOtpVeriCont, setShowVeriCon] = useState(false);

    /////// btn disabled until operation  not completed
    const [btnDisabed, setBtnDisabled] = useState(false);
    /////// Verify button disaabled until operation not complete
    const [verifyBtnDisable, setVerifyBtnDisabled] = useState(false);
    // console.log(serviceType, contextEmail, contextName, contextPassword);

    ////////Here we are write the calling api react query function and call the login fuction and resend  confermation mail
    const { mutateAsync: loginApiCall } = useMutation(userLoginAccount);
    const { mutateAsync: loginV1 } = useMutation(userLoginAccount);
    // const { mutateAsync: resendVerificationMail } = useMutation(resendConfermationEMail);

    // serviceType === "createAccount"
    // serviceType === "createAccount"
    // serviceType === "loginVerification"
    ///////// Signup otp verification/////////
    const { mutateAsync: SignUpOtpVerification } = useMutation(otpSignUpVerify);

    const signupVerificationOtp = async (getOtp, email, userName = 'jai', password) => {
        const postData = {
            "email": email,
            "codeEmailVerify": getOtp
        }
        setVerifyBtnDisabled(true);
        try {
             const otpResponse = await SignUpOtpVerification({ ...postData });

            if (otpResponse.status == true&&otpResponse.status!=='false') {
                console.log("enter in response area")
                const response = await loginApiCall({ email, password });

                if (response.status == true) {

                    toast.success("OTP verified successfully.Please wait we are setup your account.");
                    // setTimeout(async () => {
                        localStorage.clear();
                        const AgainLoginresponse = await loginApiCall({ email, password });
                        if (AgainLoginresponse.status == true) {
                            localStorage.setItem("token", AgainLoginresponse?.token)
                            localStorage.setItem("userInfo", AgainLoginresponse?._id)
                            setVerifyBtnDisabled(false)
                            setIsAuthenticated(true)
                            navigate("/companyDetail")
                        }
                    // }, [1000])
                }
            } else {

                toast.error("Otp not matched");
                setVerifyBtnDisabled(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("Semething is wrong")
            setVerifyBtnDisabled(false);
        }

    }

    const otpVerifyBtn = async (serviceType) => {
        if ((OtpValue === "") || (OtpValue.length !== 6)) {
            toast.error("Please enter six digit OTP.");
            return null;
        }

        if (serviceType === "createAccount" || serviceType === "loginVerification") {
            await signupVerificationOtp(OtpValue, contextEmail, contextName, contextPassword);
            return null;
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
                                <Button 
                                // onClick={() => resendOtpInMail(contextEmail)}
                                 style={{ fontWeight: 700, color: "#1c529b" }}>
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