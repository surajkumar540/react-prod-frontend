import { useState, createContext } from 'react'
import { Route, Router, Routes, useNavigate, useParams, useLocation } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material';
import { useEffect } from 'react';
import FileUpload from './pages/FileUpload';
import FolderData from './pages/FolderData';
import MyMessage from './pages/MyMessage';
import CompanyDetails from './pages/CompanyDetails';
import InviteTeam from './pages/InviteTeam';
import ContentModels from './pages/ContentModels';
import AllFiles from './pages/AllFiles';
import ChatProvider from './Context/ChatProvider';
import ServiceProvider from './Context/ServiceProvider';
import LoginPage from './components/AuthPages/LoginPage';
import { SignupPage } from './components/AuthPages/SignupPage';
import GetStart from './components/AuthPages/GetStart';
import ForgetPage from './components/AuthPages/ForgetPage';
import OtpVerfPage from './components/AuthPages/OtpVerfPage';
import ForgetEmail from './components/AuthPages/ForgetEmail';
import ProjectName from './pages/ProjectName';
import FolderFiles from './pages/FolderFiles';
import MyAccount from './pages/MyAccount';
import { userTokenVerify } from './api/InternalApi/OurDevApi';
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


    const checkAuthentication = async() => {
        const userId = localStorage.getItem("userInfo");
        const pathname = location.pathname;
        try{
            const response=await userTokenVerify();
            if(response.status===true)
            {
                setIsAuthenticated(true)
                if (pathname == '/login' || pathname == '/signup' || pathname == '/getStart' || pathname == '/getstart' || pathname == '/forgetEmail' || pathname == '/forget-password' || pathname == '/' )
                {
                    navigate("/chat")
                } 
            }else{
                setIsAuthenticated(false)
                localStorage.removeItem("token");
                localStorage.removeItem("userinfo");
                if (pathname == '/login' || pathname == '/signup' || pathname == '/getStart' || pathname == '/forgetEmail' || pathname == '/forget-password') {
                    navigate(pathname)
                } else {
                    navigate("/getStart")

                }
            }
        }catch(err)
        {

            setIsAuthenticated(false)
            localStorage.removeItem("token");
             localStorage.removeItem("userInfo");
                if (pathname == '/login' || pathname == '/signup' || pathname == '/getStart' || pathname == '/forgetEmail' || pathname == '/forget-password') {
                    navigate(pathname)
                } else {
                    navigate("/getStart")

                }
        }
    }

    useEffect(() => {
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
                            <Route path="/login" element={<LoginPage serviceType="login" setIsAuthenticated={setIsAuthenticated} />} />
                            <Route path="/signup" element={<SignupPage serviceType="signup" />} />
                            <Route path="/getStart" element={<GetStart serviceType='start' />} />
                            <Route path="/forgetEmail" element={<ForgetEmail serviceType='forgetEmail ' />} />
                            <Route path="/forget-password" element={<ForgetPage serviceType='forgetPassword' />} />
                            <Route path="/otpVerf" element={<OtpVerfPage serviceType='otpVerf' setIsAuthenticated={setIsAuthenticated} />} />
                        </Routes>
                    </ServiceProvider>
                    :
                    <ChatProvider>
                        
                        <Routes>
                            <Route path="/companyDetail" element={<CompanyDetails />} />
                            <Route path="*" element={<>404 page</>} />
                        </Routes>


                        <Routes>

                            <Route path="/files/allFiles" element={<AllFiles />} />
                            <Route path="/files/upload" element={<FileUpload />} />
                            <Route path="/files/folder" element={<FolderData userId={userId} />} />
                            <Route path="/files/folder/:fid" element={<FolderFiles userId={userId} />} />
                            <Route path="/chat" element={<MyMessage userId={userId} />} />
                            <Route path="/account" element={<MyAccount closeSideList={true}/>} />

                        </Routes>

                        

                    </ChatProvider>
                }

            </ThemeProvider >

        </>
    )
}

export default App