import axios from "axios";
const devURL = "https://devorganaise.com/api";
///"http://13.57.89.208:8000/api"
//
const localUrl = "http://localhost:8000/api";

const UserApiVersion = "api/signup";
const OtpApiVersion = "api/verify";
const ChatApiVersion = "api/v2/chat";
const MessageApiVersion = "api/v2/message";

// axios.interceptors.request.use(config => {
//     config.headers['Content-Type'] = 'application/json';
//     return config;
// });

const headerData =
{
    headers: {
        'Content-Type': 'application/json'
    }
}

//////-------------------------------///////////
/////user verification already exists or not api call in new  version////
//////-------------------------------///////////

export const userTokenVerify = async () => {
    const response = await axios.get(`api/tokenVerification`, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}
//////-------------------------------///////////
/////user verification already exists or not api call in new  version////
//////-------------------------------///////////

export const getStartedVerify = async (getData) => {
    const response = await axios.post(`api/emailCheck`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}
//////-------------------------------///////////
/////user inserting api call in new  version////
//////-------------------------------///////////

export const userCreateAccount = async (getData) => {
    const response = await axios.post(`${UserApiVersion}`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}
//////-------------------------------///////////
/////user sign up otp verify call in new  version////
//////-------------------------------///////////

export const otpSignUpVerify = async (getData) => {
    const response = await axios.post(`${OtpApiVersion}`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}

////////-----------------------------//////////
//////// user login our new version ///////////
///////-----------------------------///////////

export const userLoginAccount = async (getData) => {
    const response = await axios.post(`api/signin`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}

export const ForgetEmailOtp = async (getData) => {
    const response = await axios.post(`api/sendOtpForgetPassword`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}



////////-----------------------------//////////
//////// resend email our new login ///////////
///////-----------------------------///////////

export const resendVerification = async (getData) => {
    const response = await axios.post(`api/resendVeriCode`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}

export const forgetPasswordVerify = async (getData) => {
    const response = await axios.post(`api/forgetPasswordChange`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}


///////----------------------------///////////
/////// search user on new version ///////////
///////----------------------------///////////

export const searchUserV1 = async (getData) => {

    const response = await axios.get(`api/v2/chat/searchUser?search=${getData.search}`, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}


/////////-----------------------------/////////
///////// access the chat /////////////////////
///////////------------------------////////////

export const SingleUserchatAccess = async (getData) => {
    const response = await axios.post(`${ChatApiVersion}`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}


////////// ----------------------------- ////////
////////// fetch chat of group or user//////////
//////////-------------------------------////////

export const fetchAllChatSingleUserOrGroup = async () => {
    const response = await axios.get(`${ChatApiVersion}`, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}



export const createGroupChat = async (getData) => {
    const response = await axios.post(`${ChatApiVersion}/group`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}

export const AddMemberInGroup = async (getData) => {
    const response = await axios.put(`api/v2/chat/groupadd`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}

export const RemoveMemberInGroup = async (getData) => {
    const response = await axios.put(`api/v2/chat/groupremove`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}


/////////////----------------------------///////////
///////////// sending message here /////////////////
/////////////----------------------------///////////

export const sendV1Message = async (getData) => {
    const response = await axios.post(`${MessageApiVersion}`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data;
}


export const fetchMessagesV1 = async (getData) => {
    const response = await axios.get(`${MessageApiVersion}/${getData.chatId}`, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data;
}







////////// Create company api call
export const postCompannyName = async (getData) => {
    const response = await axios.post(`api/v2/company/create`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}

export const getCompanyName = async (userID) => {
    const response = await axios.get(`api/v2/company/?${userID}`);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}

export const getAllFilesApi = async (getData) => {
    const response = await axios.post(`api/v2/file/getfiles`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}

export const removeFileApi = async (getData) => {
    const response = await axios.post(`api/removeFile`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}


///////delete file
export const deleteFileApi = async (getData) => {
    const response = await axios.delete(`api/v2/file/deleteFile`, { data: getData }, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}



export const deleteFileFromFolderApi = async (getData) => {
    const response = await axios.put(`api/v2/folder/folderFileDelete`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}

export const getFileFolderApi = async (folderId) => {
    const response = await axios.get(`api/v2/folder/folderFiles/${folderId}`,headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}