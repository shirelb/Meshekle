import {Platform} from "react-native";

export const SERVER_URL = Platform.select({
    ios: "http://localhost:3000",
    android: "http://192.168.0.104:3000"
});

/*const SERVER_URL = __DEV__ ?
    Platform.select({
        ios: "http://localhost:3000",
        android: "http://10.0.2.2:3000"
    }) :
    "https://my-production-url.com";*/