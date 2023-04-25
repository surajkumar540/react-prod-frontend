import io from "socket.io-client";
const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const userID = localStorage.getItem("userInfo");
const socket = io(`${ENDPOINT}`, {
    debug: true,
    auth:{
        uid: userID
    }
});


socket.on("connect_error", (err) => {
    console.error("Connection error:", err);
});
socket.on("connect_timeout", (timeout) => {
    console.error("Connection timeout:", timeout);
});
export default socket;