import strings from "./strings";

var loginPageMapper = function (value) {
    switch(value) {
        case "userId doesn't exist!":
            return strings.loginPageStrings.NO_SUCH_USER;
        default:
            return strings.loginPageStrings.WRONG_CREDENTIALS;
    }
};

var mainScreenMapper = function (value) {
    switch(value) {
    }
};

export default {loginPageMapper,mainScreenMapper};
