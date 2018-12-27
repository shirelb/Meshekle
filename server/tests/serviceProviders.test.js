var expect = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let server = require('../app');

chai.use(chaiHttp);

const db = require('../DBorm/DBorm');
const {sequelize, Users, ServiceProviders} = require('../DBorm/DBorm');



describe('service providers route', function () {
    this.timeout(20000);

    beforeEach((done) => {
        setTimeout(function () {
            done();
        }, 1000);
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

        it('it should GET all the service providers with given name', (done) => {
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

    // get service provider by role
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
        it('it should GET the appointmentWayType of a given service provider', (done) => {
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

    //Add service provider test
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

    //delete role of a service provider
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
        it('it should DELETE the serviceProviders with the given userId', (done) => {
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
        it('it should update the appointmentWayType of the service provider', (done) => {
            chai.request(server)
                .post('/api/serviceProviders/login/authenticate')
                .send({userId:'111111111',password:'123456789'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.result.should.be.eql(true);
                    res.body.serviceProviderId.should.be.eql('123456789');
                    done();
                });
        });
        it('it should update the appointmentWayType of the service provider', (done) => {
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
    describe('/DELETE delete a serviceProvider by userId', () => {
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