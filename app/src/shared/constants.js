import {Platform} from "react-native";
import io from "socket.io-client";


const SERVER_URL = "http://212.199.203.85:80";


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