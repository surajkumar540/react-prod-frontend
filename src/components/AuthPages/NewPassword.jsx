import {
    Box, Grid, Typography, TextField,
    Button, IconButton, InputAdornment
} from '@mui/material'

import CircularProgress from '@mui/material/CircularProgress';
import React, {useState } from 'react'
import organaiseLogo from "../../assets/Logo/organaise-logo.png";
import signupPageBgImg from "../../assets/BackgroundImages/signupBackgroundImg.png"
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
/////Import react query functions
import { passwordValidator } from '../../utils/validation';
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

const NewPassword = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPass, setShowConfPass] = useState(false);
    const [OtpValue, setOtpValue] = useState('');////otp value store here
    const [showOtpVeriCont, setShowVeriCon] = useState(false);
    /////Store email address
    const { serviceType, setSeviceType } = ServiceState();
    const [fullName, setFullName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    // const [phoneNumber, setPhoneNumber] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [btnDisabed, setBtnDisabled] = useState(false);
    const [verifyBtnDisable, setVerifyBtnDisabled] = useState(false);

    const navigate = useNavigate();
    const buttonAction = async () => {
        if (firstName === "" || emailAddress === "" || password === "" || confirmPassword === "") {
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

    }

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfPassword = () => {
        setShowConfPass(!showConfPass);
    }
    return (
        <Box container   >
            <Grid container padding={7}>
                <Grid item xs={12} sm={12} md={6}  >
                    <Box container display='flex' flexDirection='column'>
                        <Box paddingLeft={4}>
                            <img
                                src={organaiseLogo}
                                style={{ width: "150px" }}
                                alt="organaise-logo-login-page" />
                        </Box>
                        <Box paddingLeft={4}>
                            <img src={signupPageBgImg} style={{ width: "70%" }} alt="signUp-page-background-image" />
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} display={'flex'} justifyContent={'center'} >
                    <Grid container xs={8}  >
                        {/* <Box display='flex' gap={2} > */}

                        <Grid item xs={12}  >

                            <Box paddingBottom={2}>
                                <Typography variant="h4" fontWeight='600' color="#333333">
                                    Reset Password
                                </Typography>
                            </Box>
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
                                disabled={btnDisabed}
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
                                Change Password
                            </Button>

                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box >
    )
}
export default NewPassword;