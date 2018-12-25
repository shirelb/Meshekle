module.exports = (sequelize, type) => {
    return sequelize.define('ApartmentConstraints', {
        constraintName:{
            type: type.STRING,
            primaryKey: true,
            required: true
        },
        constraintValue: {
            type: type.INTEGER,
            required: true
        },
        description: {
            type: type.STRING,
            required: true
        },
    });
};
