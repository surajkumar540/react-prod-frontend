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
import {forgetPasswordVerify } from '../../api/InternalApi/OurDevApi';
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

const ForgetPage = () => {


    const { serviceType, contextEmail } = ServiceState();
    const [showConfPass, setShowConfPass] = useState(false);
    const [showOtpVeriCont, setShowVeriCon] = useState(false);
    /////Store email address
    const [emailAddress, setEmailAddress] = useState(contextEmail);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    /////// btn disabled until operation  not completed
    const [btnDisabed, setBtnDisabled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    /////// Verify button disaabled until operation not complete
    const [verifyBtnDisable, setVerifyBtnDisabled] = useState(false);

    const navigate = useNavigate();
    const { mutateAsync: resetPasswordFunCall, isLoading: resetPasswordIsLoading } = useMutation(forgetPasswordVerify);

    const updateNewPassword = async () => {
        setVerifyBtnDisabled(true)
        // let userName = email.split('@')[0]
        const forgetData = {
            "email": emailAddress,
            "otp": otp,
            "password": password
        }
        const updatePassword = await resetPasswordFunCall({ ...forgetData });

        if (updatePassword.statusCode == 200) {
            toast.success("Password update successfullly.Please wait we are redirect in login page.");
            setTimeout(() => {
                setVerifyBtnDisabled(false)
                window.location = "/login";
            }, [3000])
        } else {
            toast.error(updatePassword?.error?.message || "Something is wrong");
            setVerifyBtnDisabled(false)
        }
    }

    const buttonAction = async () => {

        if (password === "") {
            toast.error("Please fill email.")
            return null;
        }
        if (password != confirmPassword) {
            toast.error("Please match confirm password")
            return null;
        }

        updateNewPassword(emailAddress);
    }

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfPassword = () => {
        setShowConfPass(!showConfPass);
    }

    return (

    <Box container  >
            <Grid container padding={{ xs: 1, sm: 5 }}>
                {/* grid1 */}
                <Grid item xs={12} >
                    <Box container display={{ xs: 'start', sm: 'flex' }} >
                        <Grid item xs={6} sm={10} paddingLeft={{ xs: 2, sm: 2, md:6 }}>
                            <img
                                src={organaiseLogo}
                                style={{ width: "150px" }}
                                alt="organaise-logo-login-page" />
                        </Grid>
                        <Grid item xs={12} sm={9} md={8} display='flex' justifyContent={{ xs: 'center', md: 'start' }}>
                            <Typography variant="h4" fontSize={{ xs: '26px', sm: '33px', md: '40px' }} fontWeight='600' color="#333333"  marginY={{ xs: 3, sm: 0 }}>
                                Forget Account
                            </Typography>
                        </Grid>
                    </Box>
                </Grid>
                {/* grid2 */}
                <Grid item xs={12} sm={12} md={12} display={'flex'} justifyContent={'center'} >
                    <Grid container xs={12} display='flex' >

                        <Grid item xs={12} sm={6} paddingBottom={2}  >
                            <Box paddingLeft={4} display='flex' justifyContent='center'>
                                <img src={forgetPassPageBGImg} style={{ width: "57%" }} alt="forget-page-background-image" />
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} display='flex' justifyContent='center' >
                            <Grid item xs={11} sm={10} md={9} >
                                <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                                    <TextField
                                        id="login-signup-forgetPassword-email"
                                        label="Email"
                                        variant='outlined'
                                        type="email"
                                        sx={cssStyle.btn_textfield}
                                        value={emailAddress ? emailAddress : ""}
                                        onChange={(e) => setEmailAddress(e?.target?.value)}
                                        // disabled
                                    />
                                </Grid>

                                <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                                    <TextField
                                        id="login-signup-forgetPassword-otp"
                                        label="Otp"
                                        type={'number'}
                                        variant='outlined'
                                        sx={cssStyle.btn_textfield}
                                        value={otp ? otp : ""}
                                        onChange={(e) => setOtp(e?.target?.value)}
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
                                        disabled={btnDisabed || resetPasswordIsLoading}
                                        onClick={() => buttonAction()}

                                    >
                                        {(btnDisabed || resetPasswordIsLoading) && (
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

                                        Change Password

                                    </Button>
                                    <Typography marginTop={3} variant="subtitle2" align='center'>
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

export default ForgetPage