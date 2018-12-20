module.exports = (sequelize, type) => {
    return sequelize.define('Announcements', {
        announcementId:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        serviceProviderId: {
            type: type.INTEGER,
            required: true
        },
        categoryId: {
            type: type.INTEGER,
            required: true
        },
        creationTime: {
            type: type.DATE,
            required: true
        },
        content: {
            type: type.STRING,
            required: true
        },
        expirationTime: {
            type: type.DATE,
            required: false
        },
        image: {
            type: type.BLOB,
            required: false
        },
        dateOfEvent: {
            type: type.DATE,
            required: false
        },
        status: {
            type: type.STRING,
            required: true
        },
    });
};