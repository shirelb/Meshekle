module.exports = (sequelize, type) => {
    return sequelize.define('UsersReleases', {
        userId:{
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        choreId: {
            type: type.INTEGER,
            primaryKey: true,
            required: true
        },
        startDate: {
            type: type.DATE,
            required: true
        },
        endDate: {
            type: type.DATE,
            required: true
        },
        
    });
};
