module.exports = {
    general: {
        superSecret: "Kibutzation",
        somethingWentWrong: "Something went wrong!",
        successfulToken: "Token generated successfully !",
    },
    usersRoute:{
        userNotFound: "userId doesn't exist!",
        appointmentRequestNotFound: "AppointmentRequest not found!",
        appointmentNotFound: "Appointment not found!",
        incidentNotFound: "Incident not found!",
        authenticationFailed: "Authentication failed due to incorrect parameters",
        failedToken: "Failed to authenticate token",
        validToken: "Token is valid!",
        tokenNotProvided: "No token provided",
        successfulAppointmentRequest: "AppointmentRequest successfully added!",
        successfulRejectAppointmentRequest: "AppointmentsRequest successfully rejected!",
        successfulAppointment: "Appointment successfully added!",
        successfulCancelAppointment: "Appointment canceled successfully!",
        successfulCancelIncident: "Incident canceled successfully!",
        alreadyCanceledIncident: "Incident already canceled !",
        alreadyResolvedIncident: "Incident already resolved !",
        alreadyCanceledAppointment: "Appointment already canceled !",
        passedAppointment: "Appointment already passed !",
        successfulIncident: "Incident successfully added!",
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
