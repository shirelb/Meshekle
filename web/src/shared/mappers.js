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
            return strings.days.DAYS_SUNDAY;
        case "Monday":
            return strings.days.DAYS_MONDAY;
        case "Tuesday":
            return strings.days.DAYS_TUESDAY;
        case "Wednesday":
            return strings.days.DAYS_WEDNESDAY;
        case "Thursday":
            return strings.days.DAYS_THURSDAY;
        case "Friday":
            return strings.days.DAYS_FRIDAY;
        case "Saturday":
            return strings.days.DAYS_SATURDAY;
        default:
            return strings.days.DAYS_UNDEFINED;
    }
};
export default {loginPageMapper, mainScreenMapper, rolesMapper,daysMapper};
