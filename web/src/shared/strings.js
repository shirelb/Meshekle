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
    SETTINGS_PAGE_TITLE: "הגדרות",
    PHONE_BOOK_PAGE_TITLE: "ספר טלפונים",
    PHONE_BOOK_PAGE_USERS_TITLE: "משתמשים",
    PHONE_BOOK_PAGE_SERVICE_PROVIDERS_TITLE: "נותני שירות",
    APPOINTMENTS_PAGE_TITLE: "תורים",
    CHORES_PAGE_TITLE: "תורנויות",
    ANNOUNCEMENTS_PAGE_TITLE: "לוח מודעות",
    ROLES_HairDresser: "מספרה",
    ROLES_Admin: "מנהלה",
    ROLES_Dentist: "רפואת שיניים",
    ROLES_Undefined: "לא נמצאו תפקידים מתאימים",

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
    OPTIONAL_TIMES: "זמנים אופציונאליים",
};

const announcementsPageStrings = {
    ANNOUNCE_REQ_TITLE_TABLE: "מודעות המחכות לאישור",
    ANNOUNCE_TITLE_TABLE: "מודעות באחריותך",
    ANNOUNCE_NUMBER:"מספר מודעה",
    ANNOUNCE_USERNAME:"שם המפרסם",
    ANNOUNCE_CATEGORY:"קטגוריה",
    ANNOUNCE_TITLE:"נושא",
    ANNOUNCE_CONTENT:"תוכן",
    ANNOUNCE_STATUS:"סטטוס",
    ANNOUNCE_FILE:"קובץ מצורף",
    ANNOUNCE_DATE_OF_EVENT:"תאריך אירוע",
    ANNOUNCE_EXPR_DATE:"תאריך תפוגה",
    OPERATION_OPTIONS:"אפשרויות",
    ADD_ANNOUNCEMENT:"פרסם מודעה חדשה",
};

const roles = {
    HairDresser: "מספרה",
    Admin: "מנהלה",
    Dentist: "רפואת שיניים",
};


const appointmentsWayType = {
    Dialog: "דיון",
    Slots: "שורה נעלמת",
    Fault: "פתיחת תקלה",
    Admin: "הכל",
};

export default {
    loginPageStrings,
    mainPageStrings,
    phoneBookPageStrings,
    appointmentsPageStrings,
    roles,
    appointmentsWayType,
    announcementsPageStrings,
};
