import {Platform} from "react-native";
import socketIOClient from "socket.io-client";


const SERVER_URL = __DEV__ ?
    Platform.select({
        ios: "http://localhost:4000",
        android: "http://192.168.0.14:4000"
    }) :
    "https://my-production-url.com";

const APP_SOCKET = socketIOClient(SERVER_URL);


export {SERVER_URL, APP_SOCKET}