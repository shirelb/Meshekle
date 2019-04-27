import strings from "./strings";

var loginPageMapper = function (value) {
    switch (value) {
        case "userId doesn't exist!":
            return strings.loginPageStrings.NO_SUCH_USER;
        default:
            return strings.loginPageStrings.WRONG_CREDENTIALS;
    }
};

var mainPageMapper = function (value) {
    switch (value) {
        default:
            return value;
    }
};

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

var appointmentRequestStatusMapper = function (value) {
    switch (value) {
        case "requested":
            return "בוקש";
        case "approved":
            return "אושר";
        case "rejected":
            return "נדחה";
        default:
            return value;
    }
};

export default {loginPageMapper, mainPageMapper, daysMapper, appointmentStatusMapper, appointmentRequestStatusMapper};
