/*
export const SERVER_URL = __DEV__ ?
    "http://192.168.0.107:4000"
    :
    "https://my-production-url.com";
*/

// import socketIOClient from "socket.io-client";
import openSocket from "socket.io-client";

const SERVER_URL = "http://192.168.0.104:4000";

const WEB_SOCKET = openSocket(SERVER_URL);

export {SERVER_URL, WEB_SOCKET}
