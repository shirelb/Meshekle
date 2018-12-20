module.exports = (sequelize, type) => {
    return sequelize.define('ChoreTypes', {
        choreTypeId:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        choreName: {
            type: type.STRING,
            required: true
        },
        days: {
            type: type.STRING,
            required: true
        },
        frequency: {
            type: type.INTEGER,
            required: true
        },
        startTime: {
            type: type.STRING,
            required: true
        },
        endTime: {
            type: type.STRING,
            required: true
        },
        color: {
            type: type.STRING,
            required: true
        },
    });
};