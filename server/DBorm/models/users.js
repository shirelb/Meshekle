module.exports = (sequelize, type) => {
    return sequelize.define('Users', {
        UserName: {
            type: type.STRING
        },
        FirstName: {
            type: type.STRING
        },
        LastName: {
            type: type.STRING
        },
        Password: {
            type: type.STRING
        },
        Email: {
            type: type.STRING
        },
        Mailbox: {
            type: type.STRING
        },
        Cellphone: {
            type: type.STRING
        },
        Phone: {
            type: type.STRING
        }
    });
};