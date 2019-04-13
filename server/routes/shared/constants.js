module.exports = {
    general: {
        SUPER_SECRET: "Kibutzation",
        SOMETHING_WENT_WRONG: "Something went wrong!",
        SUCCESSFUL_TOKEN: "Token generated successfully !",

    },
    usersRoute:{
        USER_NOT_FOUND: "userId doesn't exist!",
        APPOINTMENT_REQUEST_NOT_FOUND: "AppointmentRequest not found!",
        APPOINTMENT_NOT_FOUND: "Appointment not found!",
        INCIDENT_NOT_FOUND: "Incident not found!",
        AUTHENTICATION_FAILED: "Authentication failed due to incorrect parameters",
        FAILED_TOKEN: "Failed to authenticate token",
        VALID_TOKEN: "Token is valid!",
        TOKEN_NOT_PROVIDED: "No token provided",
        SUCCESSFUL_APPOINTMENT_REQUEST: "AppointmentRequest successfully added!",
        SUCCESSFUL_REJECT_APPOINTMENT_REQUEST: "AppointmentsRequest successfully rejected!",
        SUCCESSFUL_APPOINTMENT: "Appointment successfully added!",
        SUCCESSFUL_CANCEL_APPOINTMENT: "Appointment canceled successfully!",
        SUCCESSFUL_CANCEL_INCIDENT: "Incident canceled successfully!",
        ALREADY_CANCELED_INCIDENT: "Incident already canceled !",
        ALREADY_RESOLVED_INCIDENT: "Incident already resolved !",
        ALREADY_CANCELED_APPOINTMENT: "Appointment already canceled !",
        PASSED_APPOINTMENT: "Appointment already passed !",
        SUCCESSFUL_INCIDENT: "Incident successfully added!",
        USER_UPDATE_SUCCESS:"User fields updated successfully!",
    },
    serviceProvidersRoute:{
        USER_NOT_FOUND: "User not found!",
        APPOINTMENT_NOT_FOUND: "User not found!",
        SERVICE_PROVIDER_ALREADY_EXISTS: "Service provider already exists",

        AUTHENTICATION_FAIL: "Authentication failed due to incorrect parameters",
        SERVICE_PROVIDER_NOT_FOUND: "Service provider not found!",
        SERVICE_PROVIDER_UPDATE_SUCCESS: "Service provider fields updated successfully!",
        APPOINTMENT_WAY_OF_TYPE_UPDATE_SUCC: "Appointment way of type updated successfully!",
        SERVICE_PROVIDER_ADDED_SUCC: "ServiceProvider successfully added!",
        SERVICE_PROVIDER_ROLE_ADDED_SUCC: "ServiceProvider role successfully added!",
        SERVICE_PROVIDER_ROLE_DEL_SUCC: "Role successfully deleted!",
        SERVICE_PROVIDER_DEL_SUCC: "serviceProviders successfully deleted!",
        USER_ADDED_SUCC: "User successfully added!",
        USER_DEL_SUCC: "User successfully deleted!",
        SERVICE_PROVIDER_OPTIME_UPDATED_SUCC: "Service Provider operationTime updated successfully!",
        APPOINTMENT_STATUS_CACELLED: "Appointment status changed to cancelled successfully!",
        APPOINTMENT_UPDATED: "Appointment updated successfully!",
        INVALID_INPUT: "Invalid input",
        INVALID_ROLE_INPUT: "Invalid role input",
        INVALID_APP_WAY_TYPE_INPUT: "Invalid appointment way type input",
        INVALID_PHONE_INPUT: "Invalid phone input",
        INVALID_EMAIL_INPUT: "Invalid email input",
        INVALID_MAIL_BOX_INPUT: "Invalid email input",
        INVALID_BORN_DATE_INPUT: "Invalid email input",

        USER_ALREADY_EXISTS: "User is already exists",
    },
    appointmentStatuses:{
        APPOINTMENT_CANCELLED: "cancelled",
        APPOINTMENT_SET: "set"
    },
    appointmentRequestStatusesMapper: (status) => {
        switch (status) {
            case "requested":
                return appointmentRequestStatuses.APPOINTMENT_REQUEST_REQUESTED;
            case "approved":
                return appointmentRequestStatuses.APPOINTMENT_REQUEST_APPROVED;
            case "rejected":
                return appointmentRequestStatuses.APPOINTMENT_REQUEST_REJECTED;
            default:
                return appointmentRequestStatuses.APPOINTMENT_REQUEST_REQUESTED;
        }
    },
    appointmentRequestStatuses: {
        APPOINTMENT_REQUEST_REQUESTED: "requested",
        APPOINTMENT_REQUEST_APPROVED: "approved",
        APPOINTMENT_REQUEST_REJECTED: "rejected",
    },
    appointmentWayTypes:{
        SLOT_WAY_TYPE: "Slots",
        DIALOG_WAY_TYPE: "Dialog",
        FAULT_WAY_TYPE: "Fault",
    },
    permissionsOpNames:{

    },
    modules:{

    },
    roles:{
        DENTIST_ROLE: "Dentist",
        HAIRDRESSER_ROLE: "HairDresser",
        ADMIN_ROLE: "Admin",
    },
    statueses:{
        ON_AIR_STATUS:"On air",
        REQUEST_STATUS:"Requested",
        EXPIRED_STATUS:"Expired",
        CANCELLED_STATUS:"Cancelled"
    },
    categories:{
        SECURITY_CATEGORY:"Security",
        DINNING_ROOM_CATEGORY:"Dinning room",
        SUPERMARKET_CATEGORY:"Supermarket",
        HEALTH_CATEGORY:"Health",
        VEHICLE_CATEGORY:"Vehicle",
        SEWING_CATEGORY:"Sewing",
        GYM_CATEGORY:"Gym",
        TRIPS_CATEGORY:"Trips",
        INFRASTRUCTURE_CATEGORY:"Infastructure",
        CULTURE_CATEGORY:"Culture",
    },
    mailMessages:{
        ADD_USER_SUBJECT: "Welcome to Meshekle - There is your credentials",
        ADD_SERVICE_PROVIDER_SUBJECT:"Your new role at Meshekle!",
        BEFORE_CRED: "Welcome to Meshkele",
        BEFORE_ROLE: "You have got a new role at Meshkele",
        MAIL_END: "Have a nice day, Meshkele family"
    },
    announcementsRoute:{
        SERVICE_PROVIDER_NOT_FOUND: "Service provider not found!",
        USER_NOT_FOUND: "User not found!",
        ANNOUNCEMENT_NOT_FOUND: "Announcement not found!",
        ANNOUNCEMENT_DELETED_SUCC: "Announcement deleted successfully!",
        INVALID_EXP_TIME_INPUT:"Expiration time is invalid!",
        ILLEGAL_EXP_TIME_INPUT:"Expiration time is illegal!",
        ANNOUNCEMENT_UPDATE_SUCCESS:"Announcement updated successfully!",
        STATUS_DOESNT_EXISTS :"Status doesnt exists!",
        CATEGORY_DOESNT_EXISTS :"Category doesnt exists!",
        ANNOUNCEMENT_STATUS_UPDATE_SUCCESS :"Status updated successfully!",
        ANNOUNCEMENT_ADDED_SUCC :"Announcement added successfully!",
        CATEGORY_NOT_FOUND :"Category not found!",
        SUB_ALREADY_EXISTS :"Subscription already exists!",
        SUB_ADDED_SUCC :"Subscription added successfully!",
        SUB_NOT_FOUND :"Subscription not found!",
        SUB_UPDATED_SUCC :"Subscription updated successfully!",
        CATEGORY_ALREADY_EXISTS :"Category already exists!",
        CATEGORY_ADDED_SUCC :"Category added successfully!",
        CATEGORY_DELETED_SUCC :"Category deleted successfully!",
        SUB_DELETED_SUCC :"Subscription deleted successfully!",
    },
};
