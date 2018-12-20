module.exports = (sequelize, type) => {
    return sequelize.define('RulesModules', {
        role:{
            type: type.STRING,
            primaryKey: true,
            required: true
        },
        module: {
            type: type.STRING,
            required: true
        },
        
        
    });
};
