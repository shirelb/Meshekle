module.exports = (sequelize, type) => {
    return sequelize.define('UsersChoresTypes', {
        userId:{
            type: type.STRING,
            primaryKey: true,
            required: true
        },
        choreTypeName: {
            type: type.STRING,
            primaryKey: true,
            required: true
        },
        
    });
};
