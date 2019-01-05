import strings from "./strings";

var loginScreenMapper = function (value) {
    switch(value) {
        case "userId doesn't exist!":
            strings.NO_SUCH_USER;
            break;
        default:
            strings.WRONG_CREDENTIALS;
    }
};

var mainScreenMapper = function (value) {
    switch(value) {
        case "userId doesn't exist!":
            strings.NO_SUCH_USER;
            break;
        default:
            strings.WRONG_CREDENTIALS;
    }
};

export default {loginScreenMapper,mainScreenMapper};
