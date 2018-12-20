module.exports = (sequelize, type) => {
    return sequelize.define('UsersChores', {
        choreId:{
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        userId: {
            type: type.INTEGER,
            required: true
        },
        choreTypeId: {
            type: type.INTEGER,
            required: true
        },
        date: {
            type: type.DATE,
            required: true
        },
        isMark: {
            type: type.INTEGER,
            required: true
        },
    });
};
