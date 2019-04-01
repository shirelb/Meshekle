import {Platform} from "react-native";
import io from "socket.io-client";


const SERVER_URL = __DEV__ ?
    Platform.select({
        ios: "http://localhost:4000",
        android: "http://192.168.0.104:4000"
    }) :
    "https://my-production-url.com";


const APP_SOCKET = io(SERVER_URL, {
    transports: ['websocket'], jsonp: false
});

var connectToServerSocket = (userId) => {
    APP_SOCKET.connect();
    // APP_SOCKET.on('connect', function () {
        APP_SOCKET.on('socketServerID', function (socketServerID) {
            console.log('Connection to server established. SocketID is', socketServerID);
            APP_SOCKET.emit('storeAppClientInfo', {userId: userId});
        });
    // });
};

export {SERVER_URL, APP_SOCKET, connectToServerSocket}