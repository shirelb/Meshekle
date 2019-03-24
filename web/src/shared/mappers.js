import strings from "./strings";

var loginPageMapper = function (value) {
    switch (value) {
        case "userId doesn't exist!":
            return strings.loginPageStrings.NO_SUCH_USER;
        default:
            return strings.loginPageStrings.WRONG_CREDENTIALS;
    }
};

var mainScreenMapper = function (value) {
    switch (value) {
        case "HairDresser":
            return strings.mainPageStrings.ROLES_HairDresser;
        case "Admin":
            return strings.mainPageStrings.ROLES_HairDresser;
        default:
            return value;
    }
};

var rolesMapper = function (value) {
    switch (value) {
        case "HairDresser":
            return strings.mainPageStrings.ROLES_HairDresser;
        case "Dentist":
            return strings.mainPageStrings.ROLES_Dentist;
        case "Admin":
            return strings.mainPageStrings.ROLES_Admin;
        default:
            return strings.mainPageStrings.ROLES_Undefined;
    }
};
export default {loginPageMapper, mainScreenMapper, rolesMapper};
