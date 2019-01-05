var expect = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let server = require('../app');

chai.use(chaiHttp);
const db = require('../DBorm/DBorm');
const {sequelize, Users, ServiceProviders,ScheduledAppointments,AppointmentDetails,RulesModules,Permissions} = require('../DBorm/DBorm');
var constants = require('../routes/shared/constants');
var validiation =require('../routes/shared/validations');
var serviceProvidersRoute=constants.serviceProvidersRoute;


describe('service providers route', function () {
    this.timeout(20000);
    before((done) => {
        sequelize.sync({ force : true }) // drops table and re-creates it
            .then(function() {
                done(null);
            })
            .catch(function(error) {
                done(error);
            });
       /* setTimeout(function () {
            console.log("NOW START TESTS");
            done();
        }, 1000);*/
    });

    var tokenTest = null;


    let userTest = {
        userId: "111111111",
        fullname: "Amit mazuz",
        password: "123456789",
        email: "amit@gmail.com",
        mailbox: 444,
        cellphone: "0777007024",
        phone: "012365948",
        bornDate: "1992-05-20"
    };

    let userTest1 = {
        userId: "222222222",
        fullname: "roy elia",
        password: "123456789",
        email: "test@gmail.com",
        mailbox: 444,
        cellphone: "0777007024",
        phone: "012365948",
        bornDate: "1992-05-20"
    };
    let operationTimeTest ={
        operationTime: "[\n" +
            "    {\n" +
            "      \"day\": \"Sunday\",\n" +
            "      \"hours\": [\n" +
            "        {\n" +
            "          \"startHour\": \"10:30\",\n" +
            "          \"endHour\": \"12:00\"\n" +
            "        },\n" +
            "        {\n" +
            "          \"startHour\": \"15:30\",\n" +
            "          \"endHour\": \"20:00\"\n" +
            "        }\n" +
            "      ]\n" +
            "    },\n" +
            "    {\n" +
            "      \"day\": \"Monday\",\n" +
            "      \"hours\": [\n" +
            "        {\n" +
            "          \"startHour\": \"10:30\",\n" +
            "          \"endHour\": \"12:00\"\n" +
            "        },\n" +
            "        {\n" +
            "          \"startHour\": \"15:30\",\n" +
            "          \"endHour\": \"20:00\"\n" +
            "        }\n" +
            "      ]\n" +
            "    }\n" +
            "  ]"
    };

    let serviceProviderTest = {
        serviceProviderId: '123456789',
        role: 'Dentist',
        userId: '111111111',
        operationTime: "[\n" +
            "    {\n" +
            "      \"day\": \"Sunday\",\n" +
            "      \"hours\": [\n" +
            "        {\n" +
            "          \"startHour\": \"10:30\",\n" +
            "          \"endHour\": \"12:15\"\n" +
            "        },\n" +
            "        {\n" +
            "          \"startHour\": \"18:30\",\n" +
            "          \"endHour\": \"21:00\"\n" +
            "        }\n" +
            "      ]\n" +
            "    },\n" +
            "  ]",
        phoneNumber: '0535311303',
        appointmentWayType: constants.appointmentWayTypes.DIALOG_WAY_TYPE
    };

    let schedAppointmentTest={
        appointmentId: '1',
        startDateAndTime: '2018-12-12 11:00',
        endDateAndTime: '2018-12-12 13:00',
        remarks: 'blob',
        status: constants.appointmentStatuses.APPOINTMENT_SET
    };

    let appointmentDetailTest={
        appointmentId: '1',
        clientId: '111111111',
        serviceProviderId: '123456789',
        role: constants.roles.DENTIST_ROLE,
        subject: 'blob'
    };

    let roleModuleTest={
        role: constants.roles.DENTIST_ROLE,
        module:'Doctors'
    };

    let permissionTest={
        module:'Doctors',
        operationName:'add users',
        api:'serviceProviders'
    };


//Service provider login by userId and password
    describe('/POST Service provider login by userId and password ', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createUser(userTest1)
                                .then(
                                    done()
                                )
                        )
                );

        });
        it('it should log in the service provider to the system', (done) => {
            chai.request(server)
                .post('/api/serviceProviders/login/authenticate')
                .send({userId:'111111111',password:'123456789'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(constants.general.SUCCESSFUL_TOKEN);
                    res.body.success.should.be.eql(true);
                    res.body.should.have.property('token');
                    tokenTest = `Bearer ${res.body.token}`;
                    done();
                });
        });
        it('it should send error that the authentication failed', (done) => {
            chai.request(server)
                .post('/api/serviceProviders/login/authenticate')
                .send({userId:'111111111',password:'123456788'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.AUTHENTICATION_FAIL);
                    res.body.result.should.be.eql(false);
                    done();
                });
        });
        it('it should send error that the service provider not found', (done) => {
            chai.request(server)
                .post('/api/serviceProviders/login/authenticate')
                .send({userId:'222222222',password:'123456789'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
                    res.body.result.should.be.eql(false);
                    done();
                });
        });

        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            deleteUser(userTest1)
                                .then(
                                    done()
                                )
                        )
                );
        });
    });





    //Get all the service providers
    describe('/GET serviceProviders', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );

        });
        it('it should GET all the service providers', (done) => {
            chai.request(server)
                .get('/api/serviceProviders')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );
        });
    });
    //Get all the service providers by full name
    describe('/GET serviceProviders by full name ', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createUser(userTest1)
                                .then(
                                    done()
                                )
                        )
                );

        });

        it('it should GET all the service providers by full name', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/name/Amit mazuz')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    validiation.getUsersByUserIdPromise(res.body[0].userId).then(users =>{
                        users[0].fullname.should.be.eql("Amit mazuz");
                        done();
                        }
                    );
                });
        });

        it('it should send error that the user is not found', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/name/Amit temp')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.USER_NOT_FOUND);
                    done();
                });
        });

        it('it should send error that the service provider is not found', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/name/roy elia')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            deleteUser(userTest1)
                                .then(
                                    done()
                                )
                        )
                );
        });
    });

    // Get service provider by role
    describe('/GET serviceProviders by role ', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );

        });
        it('it should GET all the service providers with given role', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/role/'+constants.roles.DENTIST_ROLE)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    res.body[0].role.should.be.eql(constants.roles.DENTIST_ROLE);
                    done();
                });
        });
        it('it should send error that the service provider not found', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/role/'+constants.roles.HAIRDRESSER_ROLE)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );
        });
    });

    //Update service provider (in role) way of appointment
    describe('/Put serviceProviders appointmentWayType ', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );

        });
        it('it should update the appointmentWayType of the service provider in role', (done) => {
            chai.request(server)
                .put('/api/serviceProviders/serviceProviderId/123456789/role/'+constants.roles.DENTIST_ROLE+'/appointmentWayType/set')
                .set('Authorization', tokenTest)
                .send({appointmentWayType:constants.appointmentWayTypes.SLOT_WAY_TYPE})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(serviceProvidersRoute.APPOINTMENT_WAY_OF_TYPE_UPDATE_SUCC);
                    res.body.result.should.be.eql(1);
                    validiation.getServiceProvidersByServProIdPromise('123456789').then(serviceProviders => {
                        serviceProviders[0].appointmentWayType.should.be.eql(constants.appointmentWayTypes.SLOT_WAY_TYPE);
                        done();
                    })

                });
        });

        it('it should send an error that the appoint way type doesnt exists', (done) => {
            chai.request(server)
                .put('/api/serviceProviders/serviceProviderId/123456789/role/'+constants.roles.DENTIST_ROLE+'/appointmentWayType/set')
                .set('Authorization', tokenTest)
                .send({appointmentWayType:"invalid way type"})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.INVALID_APP_WAY_TYPE_INPUT);
                    done();
                });
        });

        it('it should send an error that the service provider not found', (done) => {
            chai.request(server)
                .put('/api/serviceProviders/serviceProviderId/123456781/role/'+constants.roles.DENTIST_ROLE+'/appointmentWayType/set')
                .set('Authorization', tokenTest)
                .send({appointmentWayType:constants.appointmentWayTypes.SLOT_WAY_TYPE})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
                    done();
                });
        });

        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );
        });
    });

    //Gets the appointment type by service provider id
    describe('/GET appointmentWayType by serviceProvidersId', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );

        });
        it('it should GET the appointmentWayType by service provider id', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/serviceProviderId/123456789/appointmentWayType')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body[0].appointmentWayType.should.be.eql(constants.appointmentWayTypes.DIALOG_WAY_TYPE);
                    done();
                });
        });
        it('it should send error that the service provider not found', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/serviceProviderId/123456781/appointmentWayType')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );
        });
    });

    //Add service provider
    describe('/POST add serviceProvider', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    done()
                );

        });
        it('it should ADD the service provider', (done) => {
            chai.request(server)
                .post('/api/serviceProviders/add')
                .set('Authorization', tokenTest)
                .send(serviceProviderTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_ADDED_SUCC);
                    res.body.result.serviceProviderId.should.be.eql(serviceProviderTest.serviceProviderId);
                    res.body.result.role.should.be.eql(serviceProviderTest.role);
                    res.body.result.should.have.property('userId');
                    res.body.result.should.have.property('operationTime');
                    res.body.result.should.have.property('phoneNumber');
                    res.body.result.should.have.property('appointmentWayType');
                    deleteServiceProvider(serviceProviderTest).then(done());
                });
        });
        it('it should send an error that the appointment way type doesnt exists', (done) => {
            serviceProviderTest.appointmentWayType="Invalid appointment way type";
            chai.request(server)
                .post('/api/serviceProviders/add')
                .set('Authorization', tokenTest)
                .send(serviceProviderTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.INVALID_APP_WAY_TYPE_INPUT);
                    serviceProviderTest.appointmentWayType=constants.appointmentWayTypes.DIALOG_WAY_TYPE;
                    done();
                });
        });
        it('it should send an error that the role doesnt exists', (done) => {
            serviceProviderTest.role="Invalid role";
            chai.request(server)
                .post('/api/serviceProviders/add')
                .set('Authorization', tokenTest)
                .send(serviceProviderTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.INVALID_ROLE_INPUT);
                    serviceProviderTest.role=constants.roles.DENTIST_ROLE;
                    done();
                });
        });
        it('it should send an error that the phone number is invalid', (done) => {
            serviceProviderTest.phoneNumber="invalid phone number";
            chai.request(server)
                .post('/api/serviceProviders/add')
                .set('Authorization', tokenTest)
                .send(serviceProviderTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.INVALID_PHONE_INPUT);
                    serviceProviderTest.phoneNumber="0535311303";
                    done();
                });
        });
        it('it should send an error that the user not found', (done) => {
            serviceProviderTest.userId="111111112";
            chai.request(server)
                .post('/api/serviceProviders/add')
                .set('Authorization', tokenTest)
                .send(serviceProviderTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.USER_NOT_FOUND);
                    serviceProviderTest.userId="111111111";
                    done();
                });
        });

        it('it should send an error that the service provider already exists ', (done) => {
                createServiceProvider(serviceProviderTest).then(
                    chai.request(server)
                        .post('/api/serviceProviders/add')
                        .set('Authorization', tokenTest)
                        .send(serviceProviderTest)
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_ALREADY_EXISTS);
                            done();
                        })
                );
        });

        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );
        });
    });

    //Add role to a service provider
    describe('/Put role to a serviceProvider ', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );

        });
        it('it should add role to the service provider', (done) => {
            chai.request(server)
                .put('/api/serviceProviders/roles/addToServiceProvider')
                .set('Authorization', tokenTest)
                .send({serviceProviderId:'123456789',role:constants.roles.HAIRDRESSER_ROLE,operationTime:'sunday'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_ROLE_ADDED_SUCC);
                    res.body.result.serviceProviderId.should.be.eql(serviceProviderTest.serviceProviderId);
                    res.body.result.role.should.be.eql(constants.roles.HAIRDRESSER_ROLE);
                    res.body.result.should.have.property('userId');
                    res.body.result.should.have.property('operationTime');
                    res.body.result.should.have.property('phoneNumber');
                    res.body.result.should.have.property('appointmentWayType');
                    done();
                });
        });
        it('it should send error that the role doesnt exists', (done) => {
            chai.request(server)
                .put('/api/serviceProviders/roles/addToServiceProvider')
                .set('Authorization', tokenTest)
                .send({serviceProviderId:'123456789',role:"invalid role",operationTime:'sunday'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.INVALID_ROLE_INPUT);
                    done();
                });
        });
        it('it should send error that the service provider doesnt exists', (done) => {
            chai.request(server)
                .put('/api/serviceProviders/roles/addToServiceProvider')
                .set('Authorization', tokenTest)
                .send({serviceProviderId:'123456781',role:constants.roles.HAIRDRESSER_ROLE,operationTime:'sunday'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
                    done();
                });
        });
        it('it should send error that the service provider already exists', (done) => {
            chai.request(server)
                .put('/api/serviceProviders/roles/addToServiceProvider')
                .set('Authorization', tokenTest)
                .send({serviceProviderId:'123456789',role:constants.roles.DENTIST_ROLE,operationTime:'sunday'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_ALREADY_EXISTS);
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );
        });
    });

    //Delete role of a service provider
    describe('/PUT delete role to a serviceProvider', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );
        });
        it('it should DELETE the given role to the given serviceProvider', (done) => {
            chai.request(server)
                .put('/api/serviceProviders/roles/removeFromServiceProvider')
                .set('Authorization', tokenTest)
                .send({serviceProviderId:'123456789',role:constants.roles.DENTIST_ROLE})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_ROLE_DEL_SUCC);
                    res.body.result.should.be.eql(1);
                    validiation.getServiceProvidersByServProIdPromise('123456789').then(serviceProviders => {
                        serviceProviders.length.should.be.eql(0);
                        done();
                    });
                });
        });
        it('it should send error that the role doesnt exists', (done) => {
            chai.request(server)
                .put('/api/serviceProviders/roles/removeFromServiceProvider')
                .set('Authorization', tokenTest)
                .send({serviceProviderId:'123456789',role:"invalid role"})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.INVALID_ROLE_INPUT);
                    done();
                });
        });
        it('it should send error that the service provider doesnt exists', (done) => {
            chai.request(server)
                .put('/api/serviceProviders/roles/removeFromServiceProvider')
                .set('Authorization', tokenTest)
                .send({serviceProviderId:'123456781',role:constants.roles.DENTIST_ROLE})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    done()
                );
        });
    });


//delete a service provider with a given userID
    describe('/DELETE delete a serviceProvider by userId', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            serviceProviderTest.role = constants.roles.HAIRDRESSER_ROLE,
                            createServiceProvider(serviceProviderTest)
                                .then(
                                    done()
                                )
                        )
                );
        });
        it('it should DELETE the serviceProvider by userId', (done) => {
            chai.request(server)
                .delete('/api/serviceProviders/userId/111111111/delete')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_DEL_SUCC);
                    res.body.result.should.be.eql(2);
                    validiation.getServiceProvidersByServProIdPromise('123456789').then(serviceProviders => {
                        serviceProviders.length.should.be.eql(0);
                        done()
                    });
                });
        });
        it('it should send error that the serviceProvider doesnt exists', (done) => {
            chai.request(server)
                .delete('/api/serviceProviders/userId/111111119/delete')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    serviceProviderTest.role = constants.roles.DENTIST_ROLE,
                    done()
                );
        });
    });


    //Add User
    describe('/POST add user', () => {
        it('it should ADD the user', (done) => {
            chai.request(server)
                .post('/api/serviceProviders/users/add')
                .set('Authorization', tokenTest)
                .send(userTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(serviceProvidersRoute.USER_ADDED_SUCC);
                    res.body.result.userId.should.be.eql(userTest.userId);
                    res.body.result.password.should.be.a('string');
                    validiation.getUsersByUserIdPromise(userTest.userId).then(users => {
                        users.length.should.be.eql(1);
                        deleteUser(userTest).then(
                            done()
                        );
                    });
                });
        });
        it('it should send an error that the email is invalid', (done) => {
            userTest.email="invalid email";
            chai.request(server)
                .post('/api/serviceProviders/users/add')
                .set('Authorization', tokenTest)
                .send(userTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.INVALID_EMAIL_INPUT);
                    userTest.email="amit@gmail.com";
                    done();
                });
        });
        it('it should send an error that the mail box is invalid', (done) => {
            userTest.mailbox="invalid mail box";
            chai.request(server)
                .post('/api/serviceProviders/users/add')
                .set('Authorization', tokenTest)
                .send(userTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.INVALID_MAIL_BOX_INPUT);
                    userTest.mailbox=10;
                    done();
                });
        });
        it('it should send an error that the phone is invalid', (done) => {
            userTest.phone="invalid phone number";
            chai.request(server)
                .post('/api/serviceProviders/users/add')
                .set('Authorization', tokenTest)
                .send(userTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.INVALID_PHONE_INPUT);
                    userTest.phone="0535311303";
                    done();
                });
        });
        it('it should send an error that the cellphone is invalid', (done) => {
            userTest.cellphone="invalid cellphone";
            chai.request(server)
                .post('/api/serviceProviders/users/add')
                .set('Authorization', tokenTest)
                .send(userTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.INVALID_PHONE_INPUT);
                    userTest.cellphone="0777007024";
                    done();
                });
        });
        it('it should send an error that the born date is invalid', (done) => {
            userTest.bornDate="2100-04-04";
            chai.request(server)
                .post('/api/serviceProviders/users/add')
                .set('Authorization', tokenTest)
                .send(userTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.INVALID_BORN_DATE_INPUT);
                    userTest.bornDate="1992-05-20";
                    done();
                });
        });
        it('it should send an error that the user is already exists', (done) => {
            createUser(userTest).then(
                chai.request(server)
                    .post('/api/serviceProviders/users/add')
                    .set('Authorization', tokenTest)
                    .send(userTest)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.message.should.be.eql(serviceProvidersRoute.USER_ALREADY_EXISTS);
                        done();
                    })
            );
        });

        after((done) => {
            deleteUser(userTest)
                .then(
                    done()
                );
        });
    });



//delete a user with a given userID
    describe('/DELETE delete a user by userId', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    done()
                );
        });
        it('it should DELETE the user with the given userId', (done) => {
            chai.request(server)
                .delete('/api/serviceProviders/users/userId/111111111/delete')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(serviceProvidersRoute.USER_DEL_SUCC);
                    res.body.result.should.be.eql(1);
                    validiation.getUsersByUserIdPromise('111111111').then(users => {
                       users.length.should.be.eql(0);
                       done();
                    });
                });
        });
        it('it should send an error that the user doesnt exists', (done) => {
            chai.request(server)
                .delete('/api/serviceProviders/users/userId/111111119/delete')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.USER_NOT_FOUND);
                    done();
                });
        });
    });


    //Update the operation time of a service provider
    describe('/Put serviceProvider operation time ', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );
        });
        it('it should update the operation time of the service provider', (done) => {
            chai.request(server)
                .put('/api/serviceProviders/serviceProviderId/123456789/role/'+constants.roles.DENTIST_ROLE+'/operationTime/set')
                .set('Authorization', tokenTest)
                .send(operationTimeTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_OPTIME_UPDATED_SUCC);
                    res.body.result.should.be.eql(1);
                    validiation.getServiceProvidersByServProIdPromise('123456789').then(serviceProviders => {
                        serviceProviders[0].operationTime.should.be.eql(operationTimeTest.operationTime);
                        done();
                    });
                });
        });
        it('it should send an error that the role doesnt exists', (done) => {
            chai.request(server)
                .put('/api/serviceProviders/serviceProviderId/123456789/role/invalidRole/operationTime/set')
                .set('Authorization', tokenTest)
                .send(operationTimeTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.INVALID_ROLE_INPUT);
                    done();
                });
        });
        it('it should send an error that the service provider doesnt exists', (done) => {
            chai.request(server)
                .put('/api/serviceProviders/serviceProviderId/123456781/role/'+constants.roles.DENTIST_ROLE+'/operationTime/set')
                .set('Authorization', tokenTest)
                .send(operationTimeTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );
        });
    });


    //Get the operation time of service provider with role
    describe('/GET operation time of a service provider', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );

        });
        it('it should GET the operation time of the service provider', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/serviceProviderId/123456789/role/'+constants.roles.DENTIST_ROLE+'/operationTime')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.result.should.be.eql(serviceProviderTest.operationTime);
                    done();
                });
        });
        it('it should send an error that the role doesnt exists', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/serviceProviderId/123456789/role/invalidRole/operationTime')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.INVALID_ROLE_INPUT);
                    done();
                });
        });
        it('it should send an error that the service provider doesnt exists', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/serviceProviderId/123456781/role/'+constants.roles.DENTIST_ROLE+'/operationTime')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );
        });
    });

    //Set cancelled status to appointment by appointmentID
    describe('/Put cancelled status to appointment ', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createSchedAppointment(schedAppointmentTest)
                                .then(
                                    done()
                            )
                        )
                );

        });
        it('it should update the status of the appointment to cancelled', (done) => {
            chai.request(server)
                .put('/api/serviceProviders/appointments/cancel/appointmentId/1')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(serviceProvidersRoute.APPOINTMENT_STATUS_CACELLED);
                    res.body.result.should.be.eql(1);
                    validiation.getSchedAppointmentByIdPromise(1).then(schedAppointment => {
                       schedAppointment[0].status.should.be.eql(constants.appointmentStatuses.APPOINTMENT_CANCELLED);
                       done();
                    });
                });
        });
        it('it should send an error that the appointment doesnt exists', (done) => {
            chai.request(server)
                .put('/api/serviceProviders/appointments/cancel/appointmentId/2')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.APPOINTMENT_NOT_FOUND);

                    done();
                });
        });

        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            deleteSchedAppointment(schedAppointmentTest)
                                .then(
                                    done()
                                )
                        )
                );
        });
    });



    //GET appointments details of serviceProvider
    describe('/GET appointments details of serviceProvider', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createSchedAppointment(schedAppointmentTest)
                                .then(
                                    createAppointmentDetail(appointmentDetailTest)
                                        .then(
                                            done()
                                        )
                            )
                        )
                );

        });
        it('it should GET all the appointmentsDetails of the serviceProvider', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/appointments/serviceProviderId/123456789')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
        it('it should send an error that the service provider not found', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/appointments/serviceProviderId/123456781')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            deleteSchedAppointment(schedAppointmentTest)
                                .then(
                                    deleteAppointmentDetail(appointmentDetailTest)
                                        .then(
                                            done()
                                        )
                                )
                        )
                );
        });
    });




    // Get roles of a service provider
    describe('/GET roles of serviceProvider ', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );

        });
        it('it should GET all the roles of a service provider', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/roles/serviceProviderId/123456789')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    res.body[0].should.be.eql(constants.roles.DENTIST_ROLE);
                    done();
                });
        });
        it('it should send an error that the service provider doesnt exists', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/roles/serviceProviderId/123456781')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );
        });
    });

    //GET permissions of serviceProvider
    describe('/GET permissions of serviceProvider', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            createRoleModule(roleModuleTest)
                                .then(
                                    createPermission(permissionTest)
                                        .then(
                                            done()
                                        )
                                )
                        )
                );

        });
        it('it should GET all the permissions of the serviceProvider', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/serviceProviderId/123456789/permissions')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
        it('it should send an error that the service provider doesnt exists', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/serviceProviderId/123456781/permissions')
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND);
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    deleteServiceProvider(serviceProviderTest)
                        .then(
                            deleteRoleModule(roleModuleTest)
                                .then(
                                    deletePermission(permissionTest)
                                        .then(
                                            done()
                                        )
                                )
                        )
                );
        });
    });

});






function createUser(userTest) {
    return Users.create({
        userId: userTest.userId,
        fullname: userTest.fullname,
        password: userTest.password,
        email: userTest.email,
        mailbox: userTest.mailbox,
        cellphone: userTest.cellphone,
        phone: userTest.phone,
        bornDate: new Date(userTest.bornDate),
    });
}

function deleteUser(userTest) {
    return Users.destroy({
        where: {
            userId: userTest.userId
        }
    });
}

function createServiceProvider(serviceProviderTest) {
    return ServiceProviders.create({
        serviceProviderId: serviceProviderTest.serviceProviderId,
        role: serviceProviderTest.role,
        userId: serviceProviderTest.userId,
        operationTime: serviceProviderTest.operationTime,
        phoneNumber: serviceProviderTest.phoneNumber,
        appointmentWayType: serviceProviderTest.appointmentWayType,
    });
}

function deleteServiceProvider(serviceProviderTest) {
    return ServiceProviders.destroy({
        where: {
            serviceProviderId: serviceProviderTest.serviceProviderId
        }
    });
}

function createSchedAppointment(schedAppointment) {
    return ScheduledAppointments.create({
        appointmentId: schedAppointment.appointmentId,
        startDateAndTime: schedAppointment.startDateAndTime,
        endDateAndTime: schedAppointment.endDateAndTime,
        remarks: schedAppointment.remarks,
        status: schedAppointment.status,
    });
}
function deleteSchedAppointment(schedAppointment) {
    return ScheduledAppointments.destroy({
        where: {
            appointmentId: schedAppointment.appointmentId
        }
    });
}

function createAppointmentDetail(appointmentDetail) {
    return AppointmentDetails.create({
        appointmentId: appointmentDetail.appointmentId,
        clientId: appointmentDetail.clientId,
        serviceProviderId: appointmentDetail.serviceProviderId,
        role: appointmentDetail.role,
        subject: appointmentDetail.subject,
    });
}
function deleteAppointmentDetail(appointmentDetail) {
    return AppointmentDetails.destroy({
        where: {
            appointmentId: appointmentDetail.appointmentId,
            clientId: appointmentDetail.clientId,
            serviceProviderId: appointmentDetail.serviceProviderId,
        }
    });
}


function createRoleModule(roleModule) {
    return RulesModules.create({
        role: roleModule.role,
        module: roleModule.module,
    });
}
function deleteRoleModule(roleModule) {
    return RulesModules.destroy({
        where: {
            role: roleModule.role,
            module: roleModule.module
        }
    });
}

function createPermission(permission) {
    return Permissions.create({
        module: permission.module,
        operationName: permission.operationName,
        api: permission.api,
    });
}
function deletePermission(permission) {
    return Permissions.destroy({
        where: {
            module: permission.module,
            operationName: permission.operationName,
            api: permission.api,
        }
    });
}