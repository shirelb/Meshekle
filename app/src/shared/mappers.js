import strings from "./strings";

var loginScreenMapper = function (value) {
    switch (value) {
        case "userId doesn't exist!":
            return strings.loginScreenStrings.NO_SUCH_USER;
        default:
            return strings.loginScreenStrings.WRONG_CREDENTIALS;
    }
};

var mainScreenMapper = function (value) {
    switch (value) {
    }
};

var serviceProviderRolesMapper = function (value) {
    switch (value) {
        case "Admin":
            return "מנהלה";
        case "PhoneBookSecretary":
            return "מזכירות ספר טלפונים";
        case "ChoresSecretary":
            return "מזכירות תורנויות";
        case "AnnouncementsSecretary":
            return "מזכירות לוח מודעות";
        case "appointmentsHairDresser":
            return "מספרה";
        case "appointmentsDentist":
            return "מרפאת שיניים";
        default:
            return value;
    }
};

var appointmentRequestStatusMapper = function (value) {
    switch (value) {
        case "requested":
            return "ממתין לאישור";
        case "approved":
            return "אושר";
        case "rejected":
            return "נדחה";
        default:
            return value;
    }
};

export default {loginScreenMapper, mainScreenMapper, serviceProviderRolesMapper, appointmentRequestStatusMapper};
