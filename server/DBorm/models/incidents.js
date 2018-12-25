module.exports = (sequelize, type) => {
    return sequelize.define('Incidents', {
        incidentId:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        userId: {
            type: type.INTEGER,
            required: true
        },
        category: {
            type: type.STRING,
            required: true
        },
        description: {
            type: type.STRING,
            required: false
        },
        status: {
            type: type.STRING,
            required: true
        },
        creationDate: {
            type: type.DATE,
            required: true
        },
        closeDate: {
            type: type.DATE,
            required: false
        },
        
    });
};
