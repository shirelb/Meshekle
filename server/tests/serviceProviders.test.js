var expect = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let server = require('../app');

chai.use(chaiHttp);

const db = require('../DBorm/DBorm');
const {sequelize, Users, ServiceProviders,ScheduledAppointments,AppointmentDetails,RulesModules,Permissions} = require('../DBorm/DBorm');



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

    let userTest = {
        userId: "111111111",
        fullname: "Amit mazuz",
        password: "123456789",
        email: "test@gmail.com",
        mailbox: 444,
        mobile: "1234567896",
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
        appointmentWayType: 'Dialog'
    };

    let schedAppointmentTest={
        appointmentId: '1',
        startDateAndTime: '2018-12-12 11:00',
        endDateAndTime: '2018-12-12 13:00',
        remarks: 'blob',
        status: 'set'
    };

    let appointmentDetailTest={
        appointmentId: '1',
        clientId: '111111111',
        serviceProviderId: '123456789',
        role: 'Dentist',
        subject: 'blob'
    };

    let roleModuleTest={
        role:'Dentist',
        module:'Doctors'
    };

    let permissionTest={
        module:'Doctors',
        operationName:'add users',
        api:'serviceProviders'
    };
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
                            done()
                        )
                );

        });

        it('it should GET all the service providers by full name', (done) => {
            chai.request(server)
                .get('/api/serviceProviders/name/Amit mazuz')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    res.body[0].userId.should.be.a('string');
                    res.body[0].userId.should.be.eql('111111111');
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
                .get('/api/serviceProviders/role/Dentist')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    res.body[0].role.should.be.eql('Dentist');
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

    //Update service provider way of appointment
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
        it('it should update the appointmentWayType of the service provider', (done) => {
            chai.request(server)
                .put('/api/serviceProviders/serviceProviderId/123456789/appointmentWayType/set')
                .send({appointmentWayType:'Slots'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.result.should.be.eql(1);
                    //TODO: check if the service provider (with id 123456789) appointementWayType as changed
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
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body[0].appointmentWayType.should.be.a('string');
                    res.body[0].appointmentWayType.should.be.eql('Dialog');
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
                .send(serviceProviderTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql('ServiceProvider successfully added!');
                    res.body.newServiceProvider.serviceProviderId.should.be.eql(serviceProviderTest.serviceProviderId);
                    res.body.newServiceProvider.role.should.be.eql(serviceProviderTest.role);
                    res.body.newServiceProvider.should.have.property('userId');
                    res.body.newServiceProvider.should.have.property('operationTime');
                    res.body.newServiceProvider.should.have.property('phoneNumber');
                    res.body.newServiceProvider.should.have.property('appointmentWayType');
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
                .send({serviceProviderId:'123456789',role:'HairDresser',operationTime:'sunday'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql('ServiceProvider role successfully added!');
                    res.body.newServiceProvider.serviceProviderId.should.be.eql(serviceProviderTest.serviceProviderId);
                    res.body.newServiceProvider.role.should.be.eql('HairDresser');
                    res.body.newServiceProvider.should.have.property('userId');
                    res.body.newServiceProvider.should.have.property('operationTime');
                    res.body.newServiceProvider.should.have.property('phoneNumber');
                    res.body.newServiceProvider.should.have.property('appointmentWayType');
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
                .send({serviceProviderId:'123456789',role:'Dentist'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql('Role successfully deleted!');
                    res.body.result.should.be.eql(1);
                    //TODO: check if the role of the service provider (with id 123456789) is deleted
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
                            serviceProviderTest.role = 'HairDresser',
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
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql('serviceProviders successfully deleted!');
                    res.body.result.should.be.eql(2);
                    //TODO: check if the role of the service provider (with id 123456789) is deleted
                    done();
                });
        });
        after((done) => {
            deleteUser(userTest)
                .then(
                    serviceProviderTest.role = 'Dentist',
                    done()
                );
        });
    });
    //Add a service provider
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
                .send(serviceProviderTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql('ServiceProvider successfully added!');
                    res.body.newServiceProvider.serviceProviderId.should.be.eql(serviceProviderTest.serviceProviderId);
                    res.body.newServiceProvider.role.should.be.eql(serviceProviderTest.role);
                    res.body.newServiceProvider.should.have.property('userId');
                    res.body.newServiceProvider.should.have.property('operationTime');
                    res.body.newServiceProvider.should.have.property('phoneNumber');
                    res.body.newServiceProvider.should.have.property('appointmentWayType');
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

    //Service provider login by userId and password
    describe('/POST Service provider login by userId and password ', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    createServiceProvider(serviceProviderTest)
                        .then(
                            done()
                        )
                );

        });
        it('it should log in the service provider to the system', (done) => {
            chai.request(server)
                .post('/api/serviceProviders/login/authenticate')
                .send({userId:'111111111',password:'123456789'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.success.should.be.eql(true);
                    //res.body.should.have.property('token');
                    done();
                });
        });
       /* it('it should update the appointmentWayType of the service provider', (done) => {
            chai.request(server)
                .post('/api/serviceProviders/login/authenticate')
                .send({userId:'222222222',password:'123456789'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.result.should.be.eql(false);
                    res.body.serviceProviderId.should.be.eql("");
                    done();
                });
        });*/

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

    //Add User
    describe('/POST add user', () => {
        it('it should ADD the user', (done) => {
            chai.request(server)
                .post('/api/serviceProviders/users/add')
                .send(userTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql('User successfully added!');
                    res.body.userId.should.be.eql(userTest.userId);
                    res.body.password.should.be.a('string');
                    //Check if user now exsits
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
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql('User successfully deleted!');
                    res.body.result.should.be.eql(1);
                    //TODO: check if the user (with id 123456789) is deleted
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
                .put('/api/serviceProviders/serviceProviderId/123456789/role/Dentist/operationTime/set')
                .send(operationTimeTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql('Service Provider operationTime updated successfully!');
                    res.body.result.should.be.eql(1);
                    //TODO: check if the service provider (with id 123456789) operation time as changed
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
                .get('/api/serviceProviders/serviceProviderId/123456789/role/Dentist/operationTime')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.operationTime.should.be.a('string');
                    res.body.operationTime.should.be.eql(serviceProviderTest.operationTime);
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
                            createSchedAppointment(schedAppointmentTest).then(
                                done()
                            )
                        )
                );

        });
        it('it should update the status of the appointment to cancelled', (done) => {
            chai.request(server)
                .put('/api/serviceProviders/appointments/cancel/appointmentId/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql('Appointment status changed to cancelled successfully!');
                    res.body.result.should.be.eql(1);
                    //TODO: check if the appointment (with id 1) status as changed to cancelled
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
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.roles.should.be.a('array');
                    res.body.roles.length.should.be.eql(1);
                    res.body.roles[0].should.be.eql('Dentist');
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

    /* describe('/POST users', () => {
         it('it should not POST a user without username field', (done) => {
             let userTest = {
                 firstName: "Dafna",
                 lastName: "Or",
                 password: "dafnaor11",
                 email: "dafnaor@gmail.com",
                 mailbox: 1222,
                 cellphone: "0545249499",
                 phone: "089873645"
             };

             chai.request(server)
                 .post('/api/users/add')
                 .send(userTest)
                 .end((err, res) => {
                     res.should.have.status(500);
                     res.body.should.be.a('object');
                     res.body.should.have.property('errors');
                     res.body.errors[0].path.should.equal('username');
                     done();
                 });
         });

         it('it should POST a user ', (done) => {
             let userTest = {
                 username: "dafnao",
                 firstName: "Dafna",
                 lastName: "Or",
                 password: "dafnaor11",
                 email: "dafnaor@gmail.com",
                 mailbox: 1222,
                 cellphone: "0545249499",
                 phone: "089873645"
             };

             chai.request(server)
                 .post('/api/users/add')
                 .send(userTest)
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     res.body.should.have.property('message').eql('User successfully added!');
                     res.body.newUser.should.have.property('username');
                     res.body.newUser.should.have.property('firstName');
                     res.body.newUser.should.have.property('lastName');
                     res.body.newUser.should.have.property('password');
                     res.body.newUser.should.have.property('email');
                     res.body.newUser.should.have.property('mailbox');
                     res.body.newUser.should.have.property('cellphone');
                     res.body.newUser.should.have.property('phone');
                     done();
                 });
         });
     });

     /*it('should send back a JSON object with goodCall set to true', function () {
         request(app)
           .post('/v1/auth/signin')
           .set('Content-Type', 'application/json')
           .send({ email: 'email', password: 'password' })
           .expect('Content-Type', /json/)
           .expect(200, done);
     });*!/

     it('Should respond in English as default', function () {
         let newReq = req;
         newReq.body.name = 'Jody';

         hello(newReq, res);
         expect(res.sendCalledWith).to.equal('Hello, Jody');
     });

     it('Should return greeting for english, spanish, or german', function() {
         let newReq = req;
         newReq.body.name = 'Jody';

         newReq.body.language = 'en';
         hello(newReq, res);
         expect(res.sendCalledWith).to.equal('Hello, Jody');

         newReq.body.language = 'es';
         hello(newReq, res);
         expect(res.sendCalledWith).to.equal('Hola, Jody');

         newReq.body.language = 'de';
         hello(newReq, res);
         expect(res.sendCalledWith).to.equal('Hallo, Jody');
     });*/

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