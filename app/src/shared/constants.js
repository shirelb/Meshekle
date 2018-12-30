import {Platform} from "react-native";


export const SERVER_URL = __DEV__ ?
    Platform.select({
        ios: "http://localhost:4000",
        android: "http://192.168.0.102:4000"
    }) :
    "https://my-production-url.com";