import {Table} from "semantic-ui-react/dist/commonjs/collections/Table";
import React from "react";

const loginPageStrings = {
    LOGIN: "התחבר",
    SUBMIT: "שלח",
    WELCOME_TO_LOGIN: "Welcome to the login screen!",
    USER_ID_PLACEHOLDER: "ת.ז.",
    PASSWORD_PLACEHOLDER: "סיסמא",
    APP_NAME: "משקל\'ה",
    WRONG_CREDENTIALS: "אחד הפרטים שהזנת לא נכון",
    NO_SUCH_USER: "המשתמש אינו קיים",
    EMPTY_USER_ID: "הוסף ת.ז. ונסה להתחבר שוב",
    EMPTY_PASSWORD: "הוסף סיסמא ונסה להתחבר שוב",
};

const mainPageStrings = {
    LOGOUT: "התנתק",
    WELCOME: "ברוכים הבאים ",
    MAIN_PAGE_TITLE: "בית",
    PHONE_BOOK_PAGE_TITLE: "ספר טלפונים",
    PHONE_BOOK_PAGE_USERS_TITLE: "משתמשים",
    PHONE_BOOK_PAGE_SERVICE_PROVIDERS_TITLE: "נותני שירות",
    APPOINTMENTS_PAGE_TITLE: "תורים",
    CHORES_PAGE_TITLE: "תורנויות",
    ROLES_HairDresser:"ספר/ית",
};

const phoneBookPageStrings = {
    ADD_SERVICE_PROVIDER: "נותן שירות חדש",
    ADD_USER: "משתמש חדש",
    EDIT_USER: "ערוך משתמש",
    USER_ID_HEADER: "ת.ז.",
    FULLNAME_HEADER: "שם מלא",
    PASSWORD_HEADER: "סיסמא",
    EMAIL_HEADER: "אימייל",
    MAILBOX_HEADER: "תיבת דואר",
    CELLPHONE_HEADER: "פלאפון",
    PHONE_HEADER: "טלפון",
    BORN_DATE_HEADER: "תאריך לידה",
    ACTIVE_HEADER: "קיים",
    ACTIVE_ANSWER_YES: "כן",
    ACTIVE_ANSWER_NO: "לא",
    SERVICE_PROVIDER_ID_HEADER: "ת.ז. נותן שירות",
    SERVICE_PROVIDER_ROLE_HEADER: "תפקיד",
    SERVICE_PROVIDER_USER_ID_HEADER: "ת.ז. יוזר",
    SERVICE_PROVIDER_OPERATION_TIME_HEADER: "זמני פעילות",
    SERVICE_PROVIDER_APPOINTMENT_WAY_TYPE_HEADER: "דרך קביעת תורים",
};

const appointmentsPageStrings = {
    ADD_APPOINTMENT: "תור חדש",
    APPOINTMENT_ID: "מספר מזהה",
    CLIENT_NAME: "שם משתמש",
    CLIENT_ID: "ת.ז. משתמש",
    SERVICE_PROVIDER_ID: "ת.ז. נותן שירות",
    ROLE: "ענף",
    SUBJECT: "נושא",
    STATUS: "סטאטוס",
    DATE: "תאריך",
    START_TIME: "זמן התחלה",
    END_TIME: "זמן סיום",
    REMARKS: "הערות",
};


export default {loginPageStrings, mainPageStrings, phoneBookPageStrings, appointmentsPageStrings};