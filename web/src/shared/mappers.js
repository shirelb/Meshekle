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
}

var daysMapper = function (value) {
    switch (value) {
        case "Sunday":
            return strings.days.Sunday;
        case "Monday":
            return strings.days.Monday;
        case "Tuesday":
            return strings.days.Tuesday;
        case "Wednesday":
            return strings.days.Wednesday;
        case "Thursday":
            return strings.days.Thursday;
        case "Friday":
            return strings.days.Friday;
        case "Saturday":
            return strings.days.Saturday;
        default:
            return strings.days.Undefined;
    }
};

var appointmentStatusMapper = function (value) {
    switch (value) {
        case "set":
            return "נקבע";
        case "cancelled":
            return "בוטל";
        default:
            return value;
    }
};

export default {loginPageMapper, mainScreenMapper, rolesMapper,daysMapper,appointmentStatusMapper};
