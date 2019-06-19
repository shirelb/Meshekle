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

var serviceProviderRolesMapperHebToEng = function (value) {
    switch (value) {
        case "מנהלה":
            return "Admin";
        case "מזכירות ספר טלפונים":
            return "PhoneBookSecretary";
        case "מזכירות תורנויות":
            return "ChoresSecretary";
        case "מזכירות לוח מודעות":
            return "AnnouncementsSecretary";
        case "מספרה":
            return "appointmentsHairDresser";
        case "מרפאת שיניים":
            return "appointmentsDentist";
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


var errorMapper = function (value) {
    switch (value.data.message) {
        case "userId doesn't exist!":
            return "משתמש לא קיים";
        case "user details not match, cant renew password":
            return "פרטי משתמש לא תואמים. לא ניתן לחדש סיסמא";
        case "AppointmentRequest not found!":
            return "בקשת תור לא קיימת";
        case "Appointment not found!":
            return "תור לא קיים";
        case "Incident not found!":
            return "תקלה לא קיימת";
        case "Authentication failed due to incorrect parameters":
            return "";
        case "Failed to authenticate token":
            return "";
        case "Token is valid!":
            return "";
        case "No token provided":
            return "";
        case "AppointmentRequest successfully added!":
            return "בקשת התור נוסםה בהצלחה";
        case "AppointmentsRequest successfully rejected!":
            return "בקשת התור נמחקה בהצלחה";
        case "Appointment successfully added!":
            return "התור נוסף בהצלחה";
        case "Appointment canceled successfully!":
            return "התור בוטל בהצלחה";
        case "Incident canceled successfully!":
            return "התקלה בוטלה בהצלחה";
        case "Incident already canceled !":
            return "התקלה כבר קיימת";
        case "Incident already resolved !":
            return "התקלה כבר נפתרה ונסגרה";
        case "Appointment already canceled !":
            return "התור כבר בוטל";
        case "Appointment already passed !":
            return "התור כבר עבר";
        case "Incident successfully added!":
            return "התקלה נוספה בהצלחה";
        case "User fields updated successfully!":
            return "פרטי המשתמש עודכנו בהצלחה";
        case "User not found!":
            return "משתמש לא קיים";
        case "Service provider already exists":
            return "נותן השירות כבר קיים";
        case "Service provider not found!":
            return "נותן השירות לא קיים";
        case "Service provider fields updated successfully!":
            return "פרטי נותן השירות עודכנו בהצלחה";
        case "Appointment way of type updated successfully!":
            return "דרך קביעת התורים של נותן השירות עודכנה בהצלחה";
        case "ServiceProvider successfully added!":
            return "נותן השירות נוסף בהצלחה";
        case "ServiceProvider role successfully added!":
            return "תחום אחיות חדש נוסף לנותן השירות בהצלחה";
        case "Role successfully deleted!":
            return "תחום האחריות נמחק בהצלחה";
        case "serviceProviders successfully deleted!":
            return "נותן השירות נמחק בהצלחה";
        case "User successfully added!":
            return "משתמש נוסך בהצלחה";
        case "User successfully deleted!":
            return "משתמש נמחק בהצלחה";
        case "Service Provider operationTime updated successfully!":
            return "זמן פעילות עודכן בהצלחה";
        case "Appointment status changed to cancelled successfully!":
            return "התור בוטל בהצלחה";
        case "Appointment updated successfully!":
            return "התור עודכן בהצלחה";
        case "Invalid input":
            return "קלט לא תקין";
        case "Invalid role input":
            return "תחום אחריות לא תקין";
        case "Invalid appointment way type input":
            return "דרך קביעת התורים לא תקינה";
        case "Invalid phone input":
            return "הטלפון לא תקין";
        case "Invalid email input":
            return "האימייל לא תקין";
        case "Invalid mailbox input":
            return "ת.ד. לא תקין";
        case "Invalid born date input":
            return "תאריך לידה לא תקין";
        case "User is already exists":
            return "המשתמש כבר קיים";
        case "Internal Server Error":
            return "קרתה שגיאה בשרת. אנא נסו שוב ואם השגיאה ממשיכה לקרות פנו לנציג המערכת";
        default:
            return "נסו שוב";
    }
};

export default {
    loginScreenMapper,
    mainScreenMapper,
    serviceProviderRolesMapper,
    appointmentRequestStatusMapper,
    serviceProviderRolesMapperHebToEng,
    errorMapper
};
