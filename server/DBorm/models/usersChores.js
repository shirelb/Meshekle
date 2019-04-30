module.exports = (sequelize, type) => {
    return sequelize.define('UsersChores', {
        userChoreId:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        userId: {
            type: type.STRING,
            required: true
        },
        choreTypeName: {
            type: type.STRING,
            required: true
        },
        date: {
            type: type.DATE,
            required: true
        },
        originDate: {
            type: type.DATE,
            required: true
        },
        isMark: {
            type: type.INTEGER,
            required: true
        },
    });
};
