const Sequelize = require('sequelize');
const UsersModel = require('./models/users');
// const BlogModel = require('./models/blog');
// const TagModel = require('./models/tag');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    port: 8091,
    dialect: 'sqlite',
    operatorsAliases: false,

    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // SQLite only
    storage: './sqlite.db'
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


/*const Users = sequelize.define('Users', {
    UserName: {
        type: Sequelize.STRING
    },
    FirstName: {
        type: Sequelize.STRING
    },
    LastName: {
        type: Sequelize.STRING
    },
    Password: {
        type: Sequelize.STRING
    },
    Email: {
        type: Sequelize.STRING
    },
    Mailbox: {
        type: Sequelize.STRING
    },
    Cellphone: {
        type: Sequelize.STRING
    },
    Phone: {
        type: Sequelize.STRING
    }
});*/


/*// force: true will drop the table if it already exists
Users.sync({force: true})
    .then(() => {
        // Table created
        return Users.create({
            UserName: 'JJ',
            FirstName: 'John',
            LastName: 'Hancock',
            Password: 'JJ12',
            Email: 'jj@gmail.com',
            Mailbox: 'JJ123',
            Cellphone: '0545284569',
            Phone: '042383944',
        });
    });*/

const Users = UsersModel(sequelize, Sequelize);

sequelize.sync({ force: true })
    .then(() => {
        console.log(`Database & tables created!`)
    });

module.exports = {
    Users
};