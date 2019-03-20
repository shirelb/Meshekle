process.dbMode='dev';
var expect = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

const db = require('../DBorm/DBorm');
const {sequelize, Users, AppointmentRequests, AppointmentDetails, ScheduledAppointments, Incidents, UsersChoresTypes, Events} = require('../DBorm/DBorm');

let server = require('../app');

var constants = require('../routes/shared/constants');

chai.use(chaiHttp);


describe('incidents route', function () {
    this.timeout(20000);

    before((done) => {
        setTimeout(function () {
            done();
        }, 5000);
    });

    var tokenTest = null;

    let userTest = {
        userId: "436547125",
        fullname: "test test",
        password: "tset22",
        email: "test@gmail.com",
        mailbox: 444,
        cellphone: "1234567896",
        phone: "012365948",
        bornDate: "1992-05-20"
    };

    let incidentTest = {
        userId: userTest.userId,
        category: "Plumbing",
        description: "this is a description"
    };

    let incidentTestId;


    describe('/POST incident of user', () => {
        before((done) => {
            createUser(userTest)
                .then(
                    tokenTest === null ?
                        loginAuthenticateUser(userTest)
                            .then(token => {
                                tokenTest = `Bearer ${token}`;
                                done()
                            })
                        :
                        done()
                );
        });

        it('it should POST an incident of user ', (done) => {
            chai.request(server)
                .post('/api/incidents/user/open')
                .set('Authorization', tokenTest)
                .send(incidentTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Incident successfully added!');
                    done();
                });
        });

        it('it should save the incident in Event table', (done) => {
            chai.request(server)
                .get('/api/users/events/userId/' + userTest.userId)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        after((done) => {
            Incidents.destroy({where: {}})
                .then(Events.destroy({where: {}}))
                .then(Users.destroy({where: {}}))
                .then(done())
        });
    });

    describe('/GET incidents of user', () => {
        before((done) => {
            setTimeout(function () {
                Incidents.destroy({where: {}})
                    .then(createUser(userTest)
                        .then(createIncident(incidentTest)
                            .then(incident => {
                                incidentTestId = incident.incidentId;
                                tokenTest === null ?
                                    loginAuthenticateUser(userTest)
                                        .then(token => {
                                            tokenTest = `Bearer ${token}`;
                                            done()
                                        })
                                    :
                                    done()
                            })));
            }, 5000);
        });

        it('it should GET all incidents of user by userId', (done) => {
            chai.request(server)
                .get('/api/incidents/user/userId/' + userTest.userId)
                .set('Authorization', tokenTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        after((done) => {
            Incidents.destroy({where: {}})
                .then(Users.destroy({where: {}}))
                .then(done());
        });
    });

    describe('/PUT cancel incidents of user', () => {
        before((done) => {
            tokenTest === null ?
                loginAuthenticateUser(userTest)
                    .then(token => {
                        tokenTest = `Bearer ${token}`;
                        done()
                    })
                :
                done()
        });

        describe('test with non existent incident', () => {
            before((done) => {
                setTimeout(function () {
                    createUser(userTest)
                        .then(
                            tokenTest === null ?
                                loginAuthenticateUser(userTest)
                                    .then(token => {
                                        tokenTest = `Bearer ${token}`;
                                        done()
                                    })
                                :
                                done()
                        );
                }, 5000)
            });

            it('it should not cancel an incident without existing one ', (done) => {
                chai.request(server)
                    .put(`/api/incidents/user/cancel/userId/${userTest.userId}/incidentId/1`)
                    .set('Authorization', tokenTest)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                        res.body.message.should.equal('Incident not found!');
                        done();
                    });
            });

            after((done) => {
                Users.destroy({where: {}})
                    .then(done());
            });
        });

        describe('test with existent user and existent incident', () => {
            before((done) => {
                // setTimeout(function () {
                //     Incidents.destroy({where: {}})
                //         .then(
                createUser(userTest)
                    .then(createIncident(incidentTest)
                        .then(incident => {
                            incidentTestId = incident.incidentId;
                            tokenTest === null ?
                                loginAuthenticateUser(userTest)
                                    .then(token => {
                                        tokenTest = `Bearer ${token}`;
                                        done()
                                    })
                                :
                                done()
                        }));
                // }, 5000)
            });

            it('it should cancel an incident of user ', (done) => {
                chai.request(server)
                    .put(`/api/incidents/user/cancel/userId/${userTest.userId}/incidentId/${incidentTestId}`)
                    .set('Authorization', tokenTest)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('incident');
                        res.body.incident.should.have.property('status').eql('canceled');
                        res.body.should.have.property('message').eql('Incident canceled successfully!');
                        done();
                    });
            });

            it('it should not cancel a canceled incident of user ', (done) => {
                chai.request(server)
                    .put(`/api/incidents/user/cancel/userId/${userTest.userId}/incidentId/${incidentTestId}`)
                    .set('Authorization', tokenTest)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('incident');
                        res.body.incident.should.have.property('status').eql('canceled');
                        res.body.should.have.property('message').eql('Incident already canceled !');
                        done();
                    });
            });

            it('it should delete the incident from Event table', (done) => {
                chai.request(server)
                    .get('/api/users/events/userId/' + userTest.userId)
                    .set('Authorization', tokenTest)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(0);
                        done();
                    });
            });

            after((done) => {
                Incidents.destroy({where: {}})
                    .then(Events.destroy({where: {}}))
                    .then(Users.destroy({where: {}}))
                    .then(done());
            });
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
        active: true,
    });
}

function createIncident(incidentTest) {
    return Incidents.create({
        userId: incidentTest.userId,
        category: incidentTest.category,
        description: incidentTest.description,
        status: "opened",
    });
}

function deleteUser(userTest) {
    return Users.destroy({
        where: {
            userId: userTest.userId
        }
    });
}

function loginAuthenticateUser(userTest) {
    return chai.request(server)
        .post('/api/users/login/authenticate')
        .send({
            "userId": userTest.userId,
            "password": userTest.password
        })
        .then((res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.success.should.be.true;
            res.body.should.have.property('message');
            res.body.message.should.equal(constants.general.SUCCESSFUL_TOKEN,);
            res.body.should.have.property('token');
            return res.body.token;
        })
        .catch((err) => {
            throw err;
        });
}
