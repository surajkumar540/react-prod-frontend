import { useState, createContext } from 'react'
import Typography from '@mui/material/Typography'
import { Route, Router, Routes, useNavigate, useParams, useLocation } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material';
import Dashboard from './pages/Dashboard';
import Data from './pages/Data';/////// Delete this page after creatingful design Page 
import Folder from './pages/Folder';
import Message from './pages/Message';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Setting from './pages/Setting';
import Login from "./pages/Login"; ////// Delete this page after creating Login system in authservice Page 
import ForgetPassword from './pages/ForgetPassword';
import SignUp from './pages/signup';/////Delete this page after creating signup system in authservice Page 
import { useEffect } from 'react';
// import { getAwsCredentialsFromCognito } from "./api/CognitoApi/CognitoApi";
// import { Auth } from "@aws-amplify/auth";
import configureAmplify from './services/servicesConfig';/////////// Here we are configure the authication of server
// import AuthService from './pages/AuthService';
import FileUpload from './pages/FileUpload';
import FolderData from './pages/FolderData';
import MyMessage from './pages/MyMessage';
import CompanyDetails from './pages/CompanyDetails';
import InviteTeam from './pages/InviteTeam';
import ContentModels from './pages/ContentModels';
import AllFiles from './pages/AllFiles';
import ChatProvider from './Context/ChatProvider';
import ServiceProvider from './Context/ServiceProvider';
import LeftSideBar from './components/LeftSideBar/LeftSideBar';
import { useContext } from 'react';
import LoginPage from './components/AuthPages/LoginPage';
import { SignupPage } from './components/AuthPages/SignupPage';
import GetStart from './components/AuthPages/GetStart';
import ForgetPage from './components/AuthPages/ForgetPage';
import OtpVerfPage from './components/AuthPages/OtpVerfPage';
import NewPassword from './components/AuthPages/NewPassword';
import ForgetEmail from './components/AuthPages/ForgetEmail';
import ProjectName from './pages/ProjectName';
import FolderFiles from './pages/FolderFiles';
// import MyAccount from './pages/MyAccount';

export const LeftSideBarContext = createContext(null);
function App() {
    const [leftSideData, setLeftSideData] = useState("")
    useEffect(() => {
        console.log(leftSideData)
    }, [leftSideData])
    const { pageType } = useParams();
    const theme = createTheme({
        palette: {
            primary: {
                main: '#448DF0',

            },
            secondary: {
                main: '#FF5353',
                dark: "#333333",
            }
        },
        typography: {
            fontFamily: 'Nunito',
            color: "#333333",
            fontWeight: "600"
        },

    });
    const location = useLocation();
    const navigate = useNavigate();
    const [isAnonymous, setAnonymous] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState("")

    // useEffect(() => {
    //     configureAmplify();
    //     getAwsCredentialsFromCognito();
    // }, [])

    // const setAuthenticatedUserFromCognito = () => {
    //     ///// Its return the current userInfo
    //     Auth.currentUserInfo()
    //         .then(curUser => {
    //             if (curUser.attributes?.profile === 'none') {
    //                 setIsAuthenticated(false);
    //             } else {
    //                 setUserId(curUser.attributes.sub);
    //                 setIsAuthenticated(true);
    //                 navigate(location.pathname);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(`Failed to set authenticated user! ${err}`);
    //         });
    //     //getAwsCredentialsFromCognito();
    // };

    // useEffect(() => {
    //     Auth.currentAuthenticatedUser()
    //         .then(
    //             setAuthenticatedUserFromCognito
    //         )
    //         .catch((err) => {
    //             console.log("error get in app.js", err);
    //             setIsAuthenticated(false);
    //             if (location.pathname === "/") {
    //                 // navigate("/login");
    //                 navigate("/getStart");
    //             } else {
    //                 navigate(location.pathname);
    //             }


    //         });
    // }, [Auth]);

    const checkAuthentication=()=>{
        const userId=localStorage.getItem("userInfo");
        const pathname=location.pathname;
        if(userId)
        {
            setIsAuthenticated(true)
            if(pathname=='/login'||pathname=='/signup'||pathname=='/getStart'||pathname=='/getstart'||pathname=='/forgetEmail'||pathname=='/forget-password'||pathname=='/')
            {
                navigate("/chat")
            }
        }else{        
            setIsAuthenticated(false)
            if(pathname=='/login'||pathname=='/signup'||pathname=='/getStart'||pathname=='/forgetEmail'||pathname=='/forget-password')
            {
                navigate(pathname)
            }else{
                navigate("/login")
            }
        }
    }

    useEffect(()=>{
        checkAuthentication()
    },[isAuthenticated])

    return (
        <>
            <Routes>
                <Route path="/model" element={<ContentModels />} />
                <Route path="/invite" element={<InviteTeam />} />
                <Route path="/projectName" element={<ProjectName />} />
            </Routes>
            <ThemeProvider theme={theme}>

                {!isAuthenticated
                    ?
                    
                    <ServiceProvider>

                        <Routes>
                            <Route path="/login" element={<LoginPage serviceType="login" setIsAuthenticated={setIsAuthenticated}/>} />
                            <Route path="/signup" element={<SignupPage serviceType="signup"/>} />
                            <Route path="/getStart" element={<GetStart serviceType='start' />} />
                            <Route path="/forgetEmail" element={<ForgetEmail serviceType='forgetEmail ' />} />
                            <Route path="/forget-password" element={<ForgetPage serviceType='forgetPassword' />} />
                            <Route path="/otpVerf" element={<OtpVerfPage serviceType='otpVerf'  setIsAuthenticated={setIsAuthenticated}/>} />
                            {/* <Route path="/newPassword" element={<NewPassword serviceType='newPassword' />} /> */}
                            {/* <Route path="/companyDetail" element={<CompanyDetails />} /> */}
                        </Routes>
                    </ServiceProvider>
                    :
                    <ChatProvider>
                        <Routes>

                            <Route path="/companyDetail" element={<CompanyDetails />} />
                            <Route path="/files/allFiles" element={<AllFiles />} />
                            <Route path="/files/upload" element={<FileUpload />} />
                            <Route path="/files/folder" element={<FolderData userId={userId} />} />
                            <Route path="/files/folder/:fid" element={<FolderFiles userId={userId} />} />
                            <Route path="/chat" element={<MyMessage userId={userId} />} />
                            <Route path="*" element={<>404 page</>} />
                            {/* <Route path="/account" element={<MyAccount />} /> */}
                            {/* <Route path="/" element={<MyMessage userId={userId} />} /> */}
                            {/* <Route path="/" element={<Dashboard />} /> */}
                            {/* <Route path="/data" element={<Data userId={userId} />} /> */}
                            {/** Delete code  aafter file upload feaature complete */}
                            {/* <Route path="/message" element={<Message />} /> */}
                            {/** Delete code after creaing new message feature complete */}
                            {/* <Route path="/folder" element={<Folder userId={userId} />} /> */}
                            {/** Delete code after folder feature complete */}

                            {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/settings" element={<Setting />} />  */}

                        </Routes>
                    </ChatProvider>
                }

            </ThemeProvider >

        </>
    )
}

export default App
