const Sequelize = require('sequelize');
const UsersModel = require('./models/users');
const ServiceProvidersModel = require('./models/serviceProviders');
const RolesModulesModel = require('./models/rolesModules');
const CategoriesModel = require('./models/categories');
const AnnouncementsModel = require('./models/announcements');
const AnnouncementSubscriptionsModel = require('./models/announcementSubscriptions');
const ChoreTypesModel = require('./models/choreTypes');
const UsersChoresTypesModel = require('./models/usersChoresTypes');
const UsersChoresModel = require('./models/usersChores');
const SwapRequestsModel = require('./models/swapRequests');
const UsersReleasesModel = require('./models/usersReleases');
const AppointmentRequestsModel = require('./models/appointmentRequests');
const AppointmentDetailsModel = require('./models/appointmentDetails');
const ScheduledAppointmentsModel = require('./models/scheduledAppointments');
const IncidentsModel = require('./models/incidents');
const TimeSlotBoardsModel = require('./models/timeSlotBoards');
const TimeSlotBoardAppointmentsModel = require('./models/timeSlotBoardAppointments');
const ApartmentConstraintsModel = require('./models/apartmentConstraints')
const ApartmentReservationsModel = require('./models/apartmentReservations');
const UserYearUtilizationModel = require('./models/userYearUtilization');
const EventsModel = require('./models/events');

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
    storage: process.dbMode === "dev" ?
        './DBorm/sqliteTests.db' :
        process.argv[2] === "feDev" ?
            './DBorm/sqliteFEtests.db' :
            './DBorm/sqlite.db'
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


const Users = UsersModel(sequelize, Sequelize);
const ServiceProviders = ServiceProvidersModel(sequelize, Sequelize);
const RolesModules = RolesModulesModel(sequelize, Sequelize);
const Categories = CategoriesModel(sequelize, Sequelize);
const Announcements = AnnouncementsModel(sequelize, Sequelize);
const AnnouncementSubscriptions = AnnouncementSubscriptionsModel(sequelize, Sequelize);
const ChoreTypes = ChoreTypesModel(sequelize, Sequelize);
const UsersChoresTypes = UsersChoresTypesModel(sequelize, Sequelize);
const UsersChores = UsersChoresModel(sequelize, Sequelize);
const SwapRequests = SwapRequestsModel(sequelize, Sequelize);
const UsersReleases = UsersReleasesModel(sequelize, Sequelize);
const AppointmentRequests = AppointmentRequestsModel(sequelize, Sequelize);
const AppointmentDetails = AppointmentDetailsModel(sequelize, Sequelize);
const ScheduledAppointments = ScheduledAppointmentsModel(sequelize, Sequelize);
const Incidents = IncidentsModel(sequelize, Sequelize);
const TimeSlotBoards = TimeSlotBoardsModel(sequelize, Sequelize);
const TimeSlotBoardAppointments = TimeSlotBoardAppointmentsModel(sequelize, Sequelize);
const ApartmentConstraints = ApartmentConstraintsModel(sequelize, Sequelize);
const ApartmentReservations = ApartmentReservationsModel(sequelize, Sequelize);
const UserYearUtilization = UserYearUtilizationModel(sequelize, Sequelize);
const Events = EventsModel(sequelize, Sequelize);


Events.belongsTo(ScheduledAppointments, {
    foreignKey: 'eventId',
    targetKey: 'appointmentId',
    constraints: false
});

Events.belongsTo(UsersChores, {
    foreignKey: 'eventId',
    targetKey: 'userChoreId',
    constraints: false
});

Events.belongsTo(Announcements, {
    foreignKey: 'eventId',
    targetKey: 'announcementId',
    constraints: false
});

Events.belongsTo(Incidents, {
    foreignKey: 'eventId',
    targetKey: 'incidentId',
    constraints: false
});

Users.hasMany(AppointmentDetails, {
    foreignKey: 'userId',
    targetKey: 'clientId'
});

AppointmentDetails.belongsTo(Users, {
    foreignKey: 'clientId',
    targetKey: 'userId'
});

Incidents.belongsTo(Users, {
    foreignKey: 'userId',
    targetKey: 'userId'
});

Users.hasMany(Incidents, {
    foreignKey: 'userId',
    targetKey: 'userId'
});

AppointmentDetails.hasOne(ScheduledAppointments, {
    foreignKey: 'appointmentId',
    targetKey: 'appointmentId'
});

ScheduledAppointments.belongsTo(AppointmentDetails, {
    foreignKey: 'appointmentId',
    targetKey: 'appointmentId'
});

AppointmentDetails.hasOne(AppointmentRequests, {
    foreignKey: 'appointmentId',
    targetKey: 'requestId'
});

AppointmentRequests.belongsTo(AppointmentDetails, {
    foreignKey: 'requestId',
    targetKey: 'appointmentId'
});

AppointmentRequests.belongsTo(ScheduledAppointments, {
    foreignKey: 'requestId',
    targetKey: 'appointmentId'
});

Users.hasMany(UsersChoresTypes, {
    foreignKey: 'userId',
    targetKey: 'userId'
});
UsersChoresTypes.belongsTo(Users, {
    foreignKey: 'userId',
    targetKey: 'userId'
});

Users.hasMany(UsersChores, {
    foreignKey: 'userId',
    targetKey: 'userId'
});
UsersChores.belongsTo(Users, {
    foreignKey: 'userId',
    targetKey: 'userId'
});

Users.hasMany(ServiceProviders, {
    foreignKey: 'userId',
    targetKey: 'userId'
});
ServiceProviders.hasOne(Users, {
    foreignKey: 'userId',
    targetKey: 'userId'
});

SwapRequests.belongsTo(UsersChores, {
    as: 'choreOfReceiver',
    foreignKey: 'choreIdOfReceiver',
    targetKey: 'userChoreId'
});
SwapRequests.belongsTo(UsersChores, {
    as: 'choreOfSender',
    foreignKey: 'choreIdOfSender',
    targetKey: 'userChoreId'
});


if (process.dbMode === "dev") {
    sequelize.sync({force: true})
        .then(() => {
            RolesModules.bulkCreate([
                {
                    role: "Admin",
                    module: "all",
                },
                {
                    role: "appointmentsHairDresser",
                    module: "appointments"
                },
                {
                    role: "appointmentsDentist",
                    module: "appointments"
                },
                {
                    role: "PhoneBookSecretary",
                    module: "phoneBook"
                },
                {
                    role: "ChoresSecretary",
                    module: "chores"
                },
                {
                    role: "AnnouncementsSecretary",
                    module: "announcements"
                },
            ])
                .then(response => {
                    Users.create({
                        userId: '1',
                        fullname: 'מנהל מערכת',
                        password: '4d0b24ccade22df6d154778cd66baf04288aae26df97a961f3ea3dd616fbe06dcebecc9bbe4ce93c8e12dca21e5935c08b0954534892c568b8c12b92f26a2448',
                        email: 'admin@gamil.com',
                        mailbox: 1,
                        cellphone: '0123456789',
                        phone: '0123456789',
                        bornDate: new Date('1992-11-25'),
                        active: true,
                    })
                        .then(user => {
                            ServiceProviders.create({
                                serviceProviderId: 1,
                                userId: user.userId,
                                role: 'Admin',
                                operationTime: 'all time',
                                phoneNumber: '0123456789',
                                appointmentWayType: 'Admin',
                                subjects: "[\"הכל\"]",
                                active: true,
                            })
                        })
                        .then(
                            console.log(`Database & tables created!`)
                        )
                })

        });
} else if (process.argv[2] === "feDev") {
    const fs = require('fs');
    const csv = require("csvtojson");
    let promises = [];

    sequelize.sync({force: true})
        .then(() => {
            fs.readdir('./DBorm/fakeData', (err, files) => {
                files.forEach(csvFile => {
                    promises.push(csv().fromFile('./DBorm/fakeData/' + csvFile));
                });
                Promise.all(promises)
                    .then((jsonArrayObjects) => {
                        jsonArrayObjects.forEach((jsobObj, index) => {
                            sequelize.models[files[index].split('.')[1]].bulkCreate(jsobObj)
                                .then(response =>
                                    console.log(response)
                                )
                                .catch(error =>
                                    console.log(error)
                                )
                        })
                    })
            });
        });
} else if (process.argv[2] === "galedDB") {
    const csv = require("csvtojson");

    sequelize.sync({force: true})
        .then(() => {
            csv().fromFile('./DBorm/galedPopulationUTF8.csv')
                .then((jsobObj) => {
                    Users.bulkCreate(jsobObj)
                        .then(response =>
                            console.log(response)
                        )
                        .catch(error =>
                            console.log(error)
                        )
                });

            RolesModules.bulkCreate([
                {
                    role: "Admin",
                    module: "all",
                },
                {
                    role: "appointmentsHairDresser",
                    module: "appointments"
                },
                {
                    role: "appointmentsDentist",
                    module: "appointments"
                },
                {
                    role: "PhoneBookSecretary",
                    module: "phoneBook"
                },
                {
                    role: "ChoresSecretary",
                    module: "chores"
                },
                {
                    role: "AnnouncementsSecretary",
                    module: "announcements"
                },
            ])
                .then(response => {
                    Users.create({
                        userId: '1',
                        fullname: 'מנהל מערכת',
                        password: '4d0b24ccade22df6d154778cd66baf04288aae26df97a961f3ea3dd616fbe06dcebecc9bbe4ce93c8e12dca21e5935c08b0954534892c568b8c12b92f26a2448',
                        email: 'admin@gamil.com',
                        mailbox: 1,
                        cellphone: '0123456789',
                        phone: '0123456789',
                        bornDate: new Date('1992-11-25'),
                        active: true,
                    })
                        .then(user => {
                            ServiceProviders.create({
                                serviceProviderId: 1,
                                userId: user.userId,
                                role: 'Admin',
                                operationTime: 'all time',
                                phoneNumber: '0123456789',
                                appointmentWayType: 'Admin',
                                subjects: "[\"הכל\"]",
                                active: true,
                            })
                        })
                })
        })
}


module.exports = {
    sequelize,
    Users,
    ServiceProviders,
    RolesModules,
    Categories,
    Announcements,
    AnnouncementSubscriptions,
    ChoreTypes,
    UsersChoresTypes,
    UsersChores,
    SwapRequests,
    UsersReleases,
    AppointmentRequests,
    AppointmentDetails,
    ScheduledAppointments,
    Incidents,
    TimeSlotBoards,
    TimeSlotBoardAppointments,
    ApartmentConstraints,
    ApartmentReservations,
    UserYearUtilization,
    Events,
};