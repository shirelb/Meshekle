module.exports = (sequelize, type) => {
    return sequelize.define('UserYearUtilization', {
        userId:{
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        totalVisits: {
            type: type.INTEGER,
            required: true
        },
        totalDays: {
            type: type.INTEGER,
            required: true
        },
        
    });
};
