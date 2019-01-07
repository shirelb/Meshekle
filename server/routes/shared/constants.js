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

    },
    serviceProvidersRoute:{
        USER_NOT_FOUND: "User not found!",
        APPOINTMENT_NOT_FOUND: "User not found!",
        SERVICE_PROVIDER_ALREADY_EXISTS: "Service provider already exists",

        AUTHENTICATION_FAIL: "Authentication failed due to incorrect parameters",
        SERVICE_PROVIDER_NOT_FOUND: "Service provider not found!",
        APPOINTMENT_WAY_OF_TYPE_UPDATE_SUCC: "Appointment way of type updated successfully!",
        SERVICE_PROVIDER_ADDED_SUCC: "ServiceProvider successfully added!",
        SERVICE_PROVIDER_ROLE_ADDED_SUCC: "ServiceProvider role successfully added!",
        SERVICE_PROVIDER_ROLE_DEL_SUCC: "Role successfully deleted!",
        SERVICE_PROVIDER_DEL_SUCC: "serviceProviders successfully deleted!",
        USER_ADDED_SUCC: "User successfully added!",
        USER_DEL_SUCC: "User successfully deleted!",
        SERVICE_PROVIDER_OPTIME_UPDATED_SUCC: "Service Provider operationTime updated successfully!",
        APPOINTMENT_STATUS_CACELLED: "Appointment status changed to cancelled successfully!",
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
    appointmentWayTypes:{
        SLOT_WAY_TYPE: "Slots",
        DIALOG_WAY_TYPE: "Dialog"
    },
    permissionsOpNames:{

    },
    modules:{

    },
    roles:{
        DENTIST_ROLE: "Dentist",
        HAIRDRESSER_ROLE: "HairDresser"
    },

};
