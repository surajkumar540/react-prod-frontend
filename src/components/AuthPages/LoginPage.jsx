import {
  Box, Grid, Typography, TextField,
  Button, IconButton, InputAdornment,
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import React, { useState, useEffect } from 'react'
import organaiseLogo from "../../assets/Logo/organaise-logo.png";
import loginPageBackgroundImg from "../../assets/BackgroundImages/loginBackGroundImg.png"
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query'
import { ServiceState } from '../../Context/ServiceProvider';
import { userCreateAccount, userLoginAccount, resendVerification } from '../../api/InternalApi/OurDevApi';
import { useSelector } from 'react-redux';

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

const LoginPage = ({ setIsAuthenticated }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [btnDisabed, setBtnDisabled] = useState(false);
  const emailRedux=useSelector((state)=>state.CreateAccountUserData.email)
  const navigate = useNavigate();

  // console.log(ServiceState);
  const { contextEmail,serviceType, setSeviceType, setContextEmail, setContextPassword } = ServiceState();
  // console.log(setSeviceType,setContextEmail, setContextPassword);

  ////////Here we are write the calling api react query function and call the login fuction and resend  confermation mail
  const { mutateAsync: loginApiCall } = useMutation(userLoginAccount);
  const { mutateAsync: resendVerificationMail } = useMutation(resendVerification);


  const loginAccount = async (email, password,) => {
    setBtnDisabled(true);

    const response = await loginApiCall({ email, password });
    if ((response.status === true||response.status===true)&&response.statusCode!==400) {
      toast.success("Login successfully");
      // userLoginV1(email, password);
      setTimeout(() => {
        setBtnDisabled(false);/////login , signup ,forget account btn disaabled after clicking
        // window.location = "/chat";
        setIsAuthenticated(true)
        localStorage.setItem("token", response?.token)
        localStorage.setItem("userInfo", response?._id)
        navigate("/chat")
      }, [1500])
    } else {
        if(response?.response==="Incorrect username or password.")
        {
          toast.info(response?.response)
          // navigate("/signup")
          setBtnDisabled(false)
          return;
        }
        ////////user account created but user account not activated//////
        if (response?.response === "User is not confirmed.") {
          const mailApiRes = await resendVerificationMail({ email });
          if (mailApiRes.statusCode == 200) {
            toast.info("Please check your mail inbox.");
            setBtnDisabled(false);

            setSeviceType('loginVerification')
            setContextEmail(emailAddress);
            setContextPassword(password)
            navigate("/otpVerf")

          } else {
            toast.error("Resend not working");
            setBtnDisabled(false);
          }
      }
      else {
        setBtnDisabled(false)
        // toast.error(response?.error?.message||"User is con");
      }
    }
  }

  const buttonAction = async () => {

    if (emailAddress === "" && password === "") {
      toast.error("Please fill all fields")
      return null;
    }

    if (emailAddress === "") {
      toast.error("Please fill your email")
      return null;
    }

    if (password === "") {
      toast.error("Please fill your password")
      return null;
    }
    loginAccount(emailAddress, password);
  }




  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  

  useEffect(() => {
    // setFullName("");
    setEmailAddress("");
    setPassword("");
  }, [serviceType])

  useEffect(()=>{
    if(emailRedux!=="")
    {
      setEmailAddress(emailRedux)
    }
  },[emailRedux])


  return (
    <Box container  >
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
              <img src={loginPageBackgroundImg} style={{ width: "65%" }} alt="login-page-background-image" />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6}   >
          <Box display='flex' justifyContent='center' >
            <Grid container xs={8}  >
              <Grid item xs={12}  >
                <Box paddingBottom={2}>
                  <Typography variant="h4" fontWeight='600' color="#333333">
                    Login Account
                  </Typography>
                </Box>

              </Grid>


              <Grid item xs={12} >
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

                <Box>
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
                </Box>

                <Typography variant="subtitle2" align='right' >
                  <Link to="/forgetEmail" style={{ textDecoration: "none", color: "red" }}>
                    Forget Password?
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
                      backgroundColor: '#1c529b' // background color on hover
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
                  Login

                </Button>

              </Grid>


              <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                <Typography variant="subtitle2" align='center'>
                  I don't have account so <Link to="/signup">
                    Click Here
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default LoginPage