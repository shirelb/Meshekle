import {Platform} from "react-native";


export const SERVER_URL = __DEV__ ?
    Platform.select({
        ios: "http://localhost:4000",
        android: "http://132.73.206.100:4000"
    }) :
    "https://my-production-url.com";