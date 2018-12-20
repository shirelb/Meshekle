module.exports = (sequelize, type) => {
    return sequelize.define('UsersChoresTypes', {
        userId:{
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        choreTypeId: {
            type: type.INTEGER,
            required: true
        },
        
    });
};
