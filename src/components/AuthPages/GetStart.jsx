import {
    Box, Grid, Typography, TextField,
    Button
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react'
import organaiseLogo from "../../assets/Logo/organaise-logo.png";
import loginPageBackgroundImg from "../../assets/BackgroundImages/loginBackGroundImg.png"
import { useMutation } from 'react-query'
import checkboxIcon from '../../assets/BackgroundImages/checkbox.png'
import GoogleIcon from '../../assets/svg/Google.svg'
import FacebookIcon from '../../assets/svg/Facebook.svg'
import AppleIcon from '../../assets/svg/Apple.svg'
import { getStartedVerify } from '../../api/InternalApi/OurDevApi';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { ServiceState } from '../../Context/ServiceProvider';
import { updateEmail } from '../../Redux/Reducers/CreateAccountSlice';
import { useDispatch } from 'react-redux';

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

    const dispatch = useDispatch()
    /////Store email address
    const [emailAddress, setEmailAddress] = useState("");
    /////// btn disabled until operation  not completed
    const [btnDisabed, setBtnDisabled] = useState(false);
    const navigate = useNavigate();
    const { mutateAsync: getStartedApi, isLoading: getStartedIsLoading } = useMutation(getStartedVerify)
    const { setContextEmail } = ServiceState();

    const handleSubmit = async () => {
        try {
            const dummyData = {
                "email": emailAddress
            }
            const response = await getStartedApi(dummyData)
            if (response.status) {
                dispatch(updateEmail(emailAddress))
                toast.success("Please login");
                navigate("/login")
            } else {
                dispatch(updateEmail(emailAddress))
                toast.info("Create new account");
                navigate("/signup")
            }
        } catch (error) {
            toast.error("Something is wrong");
            Navigate("/login")
        }
    }

    /////////// when clickk on the button Like -  login , signup , forget password
    const buttonAction = async () => {
        if (emailAddress === "") {
            toast.error("Please fill all fields.")
            return null;
        }
        handleSubmit()
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
                        {/*  */}
                        <Grid item xs={12} sm={8} display='flex' justifyContent={{ xs: 'center', sm: 'start' }} paddingTop={{xs:3,sm:'0'}} >
                            <Typography variant="h4" fontWeight='600' color="#333333">
                                Get Started
                            </Typography>
                        </Grid>

                        {/* <Grid xs={8} >

                            <Box sx={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} paddingX={2} paddingY={1} borderRadius={4}  >
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
                        </Grid> */}
                    </Box>
                </Grid>

                {/* grid2 */}
                <Grid item xs={12} sm={12} md={12} display={'flex'} justifyContent={'center'} >
                    <Grid container xs={12} display='flex' >

                        <Grid item xs={12} sm={6}  >
                            <Box paddingLeft={4} display='flex' justifyContent='center'>
                                <img src={loginPageBackgroundImg} style={{ width: "57%" }} alt="login-page-background-image" />
                            </Box>

                            <Grid xs={8} sm={12} display={{xs:'none',md:'flex' }}justifyContent='center'  >
                                <Box sx={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} paddingX={4} paddingY={2} borderRadius={4} width='300px' >
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
                        </Grid>

                        <Grid item xs={12} sm={6} display='flex' justifyContent='center'>
                            <Grid item xs={11} sm={12} md={9} >
                                <Grid item xs={12} sx={cssStyle.grid_textBox_button} paddingY={4} >
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
                                        disabled={btnDisabed || getStartedIsLoading}
                                        onClick={() => buttonAction()}

                                    >
                                        {(btnDisabed) && (
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


                                <Grid item xs={12} display='flex'  justifyContent={{xs:'center',sm:'start'}} alignItems='center' gap={{xs:1}} paddingY={2} fontSize={{xs:'14px' ,sm:'15px',md:'15px'}}>
                                    <Typography fontSize={{xs:'14px', md:'18px'}}>Don’t have an account? </Typography>     
                                    <Link to="/signup" style={{ textDecoration: "none", color: "#448DF0" }}>Create Account</Link>                     
                                </Grid>

                                <Grid item xs={12} display='flex' justifyContent='center' alignItems='center' gap={2} paddingY={3}>
                                    <Box height='1px' width='45%' backgroundColor='gray' />
                                    <Typography fontSize='15px'>OR</Typography>
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
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box >
    )
}

export default GetStart