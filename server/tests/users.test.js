var expect = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

const db = require('../DBorm/DBorm');
const Users = db.Users;
const ServiceProviders = db.ServiceProviders;
const Events = db.Events;

let server = require('../app');

chai.use(chaiHttp);


describe('users route', function () {
    before(() => {
        return Users.sync() // also tried with {force: true}
    });

    let userTest = {
        userId: "436547125",
        fullname: "test test",
        password: "tset22",
        email: "test@gmail.com",
        mailbox: 444,
        mobile: "1234567896",
        phone: "012365948",
        bornDate: "1992-05-20"
    };

    describe('/GET users', () => {
        it('it should GET all the users', (done) => {
            chai.request(server)
                .get('/api/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/GET users by name', () => {
        before((done) => {
            Users.create({
                userId: userTest.userId,
                fullname: userTest.fullname,
                password: userTest.password,
                email: userTest.email,
                mailbox: userTest.mailbox,
                cellphone: userTest.cellphone,
                phone: userTest.phone,
                bornDate: new Date(userTest.bornDate),
            });
            done();
        });

        it('it should GET all the user with name dafna', (done) => {
            chai.request(server)
                .get('/api/users/name/test')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        after((done) => {
            Users.destroy({
                where: {
                    userId: userTest.userId
                }
            });
            done();
        });
    });

    describe('/GET users by userId', () => {
        before((done) => {
            Users.create({
                userId: userTest.userId,
                fullname: userTest.fullname,
                password: userTest.password,
                email: userTest.email,
                mailbox: userTest.mailbox,
                cellphone: userTest.cellphone,
                phone: userTest.phone,
                bornDate: new Date(userTest.bornDate),
            });
            done();
        });

        it('it should GET all the user with userId 436547125', (done) => {
            chai.request(server)
                .get('/api/users/userId/'+userTest.userId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        after((done) => {
            Users.destroy({
                where: {
                    userId: userTest.userId
                }
            });
            done();
        });
    });

    describe('/POST appointment request of user', () => {
        it('it should POST an appointment request of user ', (done) => {
            let appointmentRequestTest = {
                userId: userTest.userId,
                serviceProviderId: 123,
                availableTime: [
                    {
                        "day": "Sunday",
                        "hours": [
                            {
                                "startHour": "10:30",
                                "endHour": "12:00"
                            },
                            {
                                "startHour": "15:30",
                                "endHour": "20:00"
                            }
                        ]
                    },
                    {
                        "day": "Monday",
                        "hours": [
                            {
                                "startHour": "10:30",
                                "endHour": "12:00"
                            },
                            {
                                "startHour": "15:30",
                                "endHour": "20:00"
                            }
                        ]
                    }
                ],
                notes: "this is a note",
                subject: " paint"
            };

            chai.request(server)
                .post('/api/users/appointments/request')
                .send(appointmentRequestTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('AppointmentRequest successfully added!');
                    done();
                });
        });
    });

    describe('/POST appointment set of user', () => {
        it('it should POST an appointment request of user ', (done) => {
            let appointmentTest = {
                userId: userTest.userId,
                serviceProviderId: 123,
                date: "2019-05-20",
                startHour: "10:00",
                endHour: "12:00",
                notes: "this is a note"
            };

            chai.request(server)
                .post('/api/users/appointments/set')
                .send(appointmentTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('appointment successfully added!');
                    done();
                });

            chai.request(server)
                .get('/api/users/events/userId/'+userTest.userId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST incident of user', () => {
        it('it should POST an appointment request of user ', (done) => {
            let incidentTest = {
                userId: userTest.userId,
                category: "Plumbing",
                description: "this is a description"
            };

            chai.request(server)
                .post('/api/users/incidents/open')
                .send(incidentTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Incident successfully added!');
                    done();
                });

            chai.request(server)
                .get('/api/users/events/userId/'+userTest.userId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST appointment user approve', () => {
        it('it should POST an appointment request of user ', (done) => {
            let bodyTest = {
                userId: userTest.userId,
                appointmentRequestId: 123,
            };

            chai.request(server)
                .post('/api/users/appointments/approve')
                .send(bodyTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    //TODO check if the status is rejected
                    res.body.should.have.property('message').eql('Event successfully added!');
                    done();
                });

            chai.request(server)
                .get('/api/users/events/userId/'+userTest.userId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST appointment user reject', () => {
        it('it should POST an appointment request of user ', (done) => {
            let bodyTest = {
                userId: userTest.userId,
                appointmentRequestId: 123,
            };

            chai.request(server)
                .post('/api/users/appointments/reject')
                .send(bodyTest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    //TODO check if the status is rejected
                    res.body.should.have.property('message').eql('Event successfully added!');
                    done();
                });

        });
    });



    describe('/POST users', () => {
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

});
