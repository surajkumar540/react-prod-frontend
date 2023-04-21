import io from "socket.io-client";
const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const socket = io(`${ENDPOINT}`, {
    debug: true
});


socket.on("connect_error", (err) => {
    console.error("Connection error:", err);
});
socket.on("connect_timeout", (timeout) => {
    console.error("Connection timeout:", timeout);
});
export default socket;