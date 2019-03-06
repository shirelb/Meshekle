var expect = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

const db = require('../DBorm/DBorm');
const {sequelize, Users, AppointmentRequests, AppointmentDetails, ScheduledAppointments, Incidents, UsersChoresTypes, Events} = require('../DBorm/DBorm');

let server = require('../app');

var constants = require('../routes/shared/constants');

chai.use(chaiHttp);


describe('users route', function () {
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

    let appointmentTest = {
        userId: userTest.userId,
        serviceProviderId: 123,
        role: "Driver",
        date: "2019-05-20",
        startHour: "10:00",
        endHour: "12:00",
        notes: "this is a note"
    };


    describe('/POST login and authenticate a user', () => {
        beforeEach((done) => {
            setTimeout(function () {
                createUser(userTest)
                    .then(
                        done()
                    )
            }, 5000);
        });

        it('it should Login, and check token', (done) => {
            loginAuthenticateUser(userTest)
                .then(token => {
                    tokenTest = `Bearer ${token}`;
                    done()
                })
        });

        after((done) => {
            deleteUser(userTest)
                .then(
                    done()
                )
        })
    });

    describe('/GET users', () => {
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

        it('it should GET all the users', (done) => {
            chai.request(server)
                .get('/api/users')
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
                    done()
                );
        });
    });

    describe('/GET users by name', () => {
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

        it('it should GET all the user with name test', (done) => {
            chai.request(server)
                .get('/api/users/name/test')
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
                    done()
                );
        });
    });

    describe('/GET users by userId', () => {
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
            }, 5000);
        });

        it('it should GET all the user with userId 436547125', (done) => {
            chai.request(server)
                .get('/api/users/userId/' + userTest.userId)
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
                    setTimeout(function () {
                        done();
                    }, 1000)
                    // done()
                );
        });

    });

    describe('/GET events of user', () => {
        before((done) => {
            setTimeout(function () {
                createUser(userTest)
                    .then(Events.create({
                        userId: appointmentTest.userId,
                        eventType: "Appointments",
                        eventId: 1
                    }))
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
            }, 5000);
        });

        it('it should GET all events of user ', (done) => {
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
            Events.destroy({where: {}})
                .then(Users.destroy({where: {}}))
                .then(done());
        });
    });

})
;

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
