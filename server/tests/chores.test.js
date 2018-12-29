var expect = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const db = require('../DBorm/DBorm');
const UsersChores = db.UsersChores;
const Users = db.Users;
const ChoreTypes = db.ChoreTypes;
const UsersChoresTypes = db.UsersChoresTypes;

let server = require('../app');

chai.use(chaiHttp);


var choreTypeTestSat = {
    choreTypeName: "satCoocking",
    days: "[saturday]",
    numberOfWorkers: 2,
    frequency: 12,
    startTime: "10:00",
    endTime: "14:00",
    color: "blue"
}

var userTest = {
    userId: "436547125",
    fullname: "test test",
    password: "tset22",
    email: "test@gmail.com",
    mailbox: 444,
    mobile: "1234567896",
    phone: "012365948",
    bornDate: "1992-05-20"
}

var choreTypeTestFri = {
    choreTypeName: "friCoocking",
    days: "[friday]",
    numberOfWorkers: 2,
    frequency: 12,
    startTime: "10:00",
    endTime: "14:00",
    color: "blue"
}
var userChoreTestNow = {
    userId: "436547125",
    choreTypeName: "satCoocking",
    date: Date.now(),//"2018-12-25 10:00",
    isMark: false
}
var userChoreTestFuture = {
    userId: "436547125",
    choreTypeName: "friCoocking",
    date: "2019-12-25 10:00",
    isMark: false
}

describe('chores route', function () {
    before(() => {
        
        return UsersChores.sync() // also tried with {force: true}
    });
/*
    describe('/GET all userChores api1', () => {
        before((done) => {
            ChoreTypes.create(choreTypeTestSat)
            .then(t=>{
                ChoreTypes.create(choreTypeTestFri)
                .then(type=>{
                    Users.create(userTest)
                    .then(user=>{
                        UsersChoresTypes.create({
                            userId: userTest.userId,
                            choreTypeName: choreTypeTestFri.choreTypeName
                        });
                        UsersChoresTypes.create({
                            userId: userTest.userId,
                            choreTypeName: choreTypeTestSat.choreTypeName
                        });
                        UsersChores.create(userChoreTestNow)
                        .then(uc=>{
                            UsersChores.create(userChoreTestFuture)
                            .then(uc2=>{

                                done();
                            })
                            .catch(err=>{
                                console.log("eror");
                            })
                        })
                        .catch(err=>{
                            console.log("eror");
                        })
                    })
                    .catch(err=>{
                        console.log("eror");
                    })
                })
                .catch(err=>{
                    console.log("eror");
                })
            })
            .catch(err=>{
                console.log("eror");
            })
        });

        it('it should GET all the users chores in future ', (done) => {
            chai.request(server)
                .get('/api/chores/usersChores/future/true')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    res.body[0].choreTypeName.should.be.eql(choreTypeTestFri.choreTypeName)
                    done();
                });
        });

        it('it should GET all the users chores in past ', (done) => {
            chai.request(server)
                .get('/api/chores/usersChores/future/false')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    res.body[0].choreTypeName.should.be.eql(choreTypeTestSat.choreTypeName)
                    done();
                });
        });

        after((done) => {
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: userTest.userId
                }
            });
            done();
        });
    });

*/

    describe('/GET all userChores api1', () => {
        before((done) => {
            ChoreTypes.create(choreTypeTestSat);
            ChoreTypes.create(choreTypeTestFri);
            Users.create(userTest);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestSat.choreTypeName
            });
            UsersChores.create(userChoreTestNow);
            UsersChores.create(userChoreTestFuture);

            done();
                    
        });

        it('it should GET all the users chores in future ', (done) => {
            chai.request(server)
                .get('/api/chores/usersChores/future/true')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    res.body[0].choreTypeName.should.be.eql(choreTypeTestFri.choreTypeName)
                    done();
                });
        });

        it('it should GET all the users chores in past ', (done) => {
            chai.request(server)
                .get('/api/chores/usersChores/future/false')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    res.body[0].choreTypeName.should.be.eql(choreTypeTestSat.choreTypeName)
                    done();
                });
        });

        after((done) => {
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: userTest.userId
                }
            });
            done();
        });
    });

    describe('/GET all choreTypes api26', () => {
        before((done) => {
            ChoreTypes.create(choreTypeTestSat);
            done();
        });

        it('it should GET all the choreTypes ', (done) => {
            chai.request(server)
            .get('/api/chores/choreTypes')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                res.body[0].choreTypeName.should.be.eql(choreTypeTestSat.choreTypeName)
                    done();
                });
            });
            
            after((done) => {
                ChoreTypes.destroy({
                    where: {
                    choreTypeName: choreTypeTestSat.choreTypeName
                    }
                });
                done();
        });
    });
    
        
    describe('/POST new choreType api19', () => {
        before((done) => {
            ChoreTypes.create(choreTypeTestSat);
            done();
        });
    
        it('it should POST new Chore type that is not exist yet', (done) => {
            chai.request(server)
                .post('/api/chores/add/choreType')
                .send(choreTypeTestFri)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('choreType successfully added!');
                    done();
                });
        });

        it('it should faild in  POST new Chore type that is allready exist yet', (done) => {
            chai.request(server)
                .post('/api/chores/add/choreType')
                .send(choreTypeTestSat)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('This choreType allready exist!');
                    done();
                });
        });
    
        after((done) => {
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {
                        [Op.or]: [choreTypeTestFri.choreTypeName, choreTypeTestSat.choreTypeName]
                    }
                }
            });
            done();
        });
    });
    


});