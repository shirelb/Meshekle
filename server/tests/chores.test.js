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
    cellphone: "1234567896",
    mobile: "1234567896",
    phone: "012365948",
    bornDate: "1992-05-20"
}

var userTest2 = {
    userId: "201449782",
    fullname: "test test",
    password: "tset22",
    email: "test@gmail.com",
    mailbox: 444,
    cellphone: "1234567896",
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
};

var choreTypeTestSun = {
    choreTypeName: "sunCoocking",
    days: "[friday]",
    numberOfWorkers: 2,
    frequency: 12,
    startTime: "10:00",
    endTime: "14:00",
    color: "blue"
};

var userChoreTestNow = {
    userId: "436547125",
    choreTypeName: "satCoocking",
    date: "2018-12-25",//Date.now(),//"2018-12-25 10:00",
    isMark: false
}
var userChoreTestFuture = {
    userId: "436547125",
    choreTypeName: "friCoocking",
    date: "2019-12-25 10:00", //new Date("2019-12-25 10:00"),
    isMark: false,
};
var choreId= 0;
var choreIdPast = 0;


describe('chores route', function () {
     this.timeout(20000);

    beforeEach((done) => {
        setTimeout(function () {
            done();
        }, 500);
    });

    //2 it's
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
            UsersChores.destroy({
                where:{
                    userId: userTest.userId
                }
            });
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

//1 it
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
                //done();
                setTimeout(function () {
                             done();
                         }, 5000);
        });
    });
   
   //2 it 
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
    
//commit
    //3 it
    describe('/POST adding user to choreType .api23', () => {
        
        before((done) => {
            setTimeout(function () {
                Users.create(userTest);
            }, 5000);
            setTimeout(function () {
                ChoreTypes.create(choreTypeTestSat);
            }, 5000);
            setTimeout(function () {
                    done();
                }, 5000);
        });
   
        it('it should POST user to Chore type ', (done) => {
            chai.request(server)
                .post('/api/chores/choreType/users/add/userId')
                .send({
                    userId: userTest.userId,
                    choreTypeName: choreTypeTestSat.choreTypeName
                })
                .end((err, res) => {
                    setTimeout(function () {
                        
                        res.body.should.have.property('message').eql('userId successfully added to choreType!');
                        res.should.have.status(200);
                    }, 5000);
                    //done();
                    //setTimeout(function () {
                             done();
                         //}, 5000);
                });
        });

        it('it should faild in  POST user that not exist to Chore type', (done) => {           
                chai.request(server)
                    .post('/api/chores/choreType/users/add/userId')
                    .send({
                        userId: "111111111",
                        choreTypeName: choreTypeTestSat.choreTypeName
                    })
                    .end((err, res) => {
                        setTimeout(function () {
                            res.should.have.status(400);
                            res.body.should.have.property('message').eql('userId doesn\'t exist!');
                           // done();
                        }, 5000);
                        //done();
                        setTimeout(function () {
                            done();
                        }, 5000);
                    });
                   
        });

        it('it should faild in POST user to Chore type that not exist', (done) => {
            chai.request(server)
                .post('/api/chores/choreType/users/add/userId')
                .send({
                    userId: userTest.userId,
                    choreTypeName: "no_such_chore"
                })
                .end((err, res) => {
                    setTimeout(function () {
                        res.should.have.status(400);
                        res.body.should.have.property('message').eql('choreType is not exist!');
                        
                    }, 5000);
                    setTimeout(function () {
                        done();
                    }, 5000);
                });
        });
   
        after((done) => {
            UsersChoresTypes.destroy({
                where: {
                    userId: userTest.userId,
                    choreTypeName: choreTypeTestSat.choreTypeName
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: choreTypeTestSat.choreTypeName
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

    //2 it
    describe('/GET userChore by choreId api2', () => {
        before((done) => {
            Users.create(userTest);
            ChoreTypes.create(choreTypeTestSat);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestSat.choreTypeName
            })
            UsersChores.create(userChoreTestNow)
            .then(created=>{
                choreId = created.userChoreId;
                console.log("\n userchoreid that created is: "+ choreId);
                done();
            })
            //done();
        });

        it('it should GET the user Chore with id ', (done) => {
            chai.request(server)
            .get('/api/chores/userChores/userChoreId/'+choreId)
            .end((err, res) => {
                res.should.have.status(200);
                setTimeout(function () {
                    res.body.should.have.property('chore');
                    res.body.chore.should.have.property('choreTypeName').eql(choreTypeTestSat.choreTypeName);
                    res.body.chore.should.have.property('userChoreId').eql(choreId);
                        done();
                }, 5000);
                });
            });

        it('it should not GET user Chore with id that does not exist ', (done) => {
            chai.request(server)
            .get('/api/chores/userChores/userChoreId/0')
            .end((err, res) => {
                res.should.have.status(400);
                //res.body.should.be.a('array');
                //res.body.length.should.be.eql(1);
                //console.log("\n res.bodydataValues:"+ res.body[0].choreTypeName+"\n");
                setTimeout(function () {
                    res.body.should.have.property('chore');
                    res.body.should.have.property('message');
                    res.body.message.should.equal('userChoreId does not exist');
                    //res.body.chore.should.have.property('userChoreId').eql(choreId);
                        done();
                }, 5000);
                });
        });
        
            after((done) => {
                UsersChores.destroy({
                    where: {
                    userId: userTest.userId
                    }
                });
                UsersChoresTypes.destroy({
                    where: {
                    choreTypeName: choreTypeTestSat.choreTypeName,
                    userId: userTest.userId
                    }
                });
                Users.destroy({
                    where: {
                    userId: userTest.userId
                    }
                });
                ChoreTypes.destroy({
                    where: {
                    choreTypeName: choreTypeTestSat.choreTypeName
                    }
                });

                //done();
                setTimeout(function () {
                             done();
                         }, 5000);
        });
    });

    //4 it's
    describe('/GET all userChores by userId api3', () => {
        before((done) => {
            ChoreTypes.create(choreTypeTestSat);
            ChoreTypes.create(choreTypeTestFri);
            Users.create(userTest);
            Users.create(userTest2);
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

        it('it should GET all the user chores in future of the userId ', (done) => {
            chai.request(server)
                .get('/api/chores/userChores/userId/'+userTest.userId+'/future/true')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('chores');
                    res.body.chores.should.be.a('array');
                    res.body.chores.length.should.be.eql(1);
                    res.body.chores[0].choreTypeName.should.be.eql(choreTypeTestFri.choreTypeName);
                    res.body.chores[0].userId.should.be.eql(userTest.userId);
                    done();
                });
        });

        it('it should GET all the user chores in past for that userId', (done) => {
            chai.request(server)
                .get('/api/chores/userChores/userId/'+userTest.userId+'/future/false')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('chores')
                    res.body.chores.should.be.a('array');
                    res.body.chores.length.should.be.eql(1);
                    res.body.chores[0].choreTypeName.should.be.eql(choreTypeTestSat.choreTypeName);
                    res.body.chores[0].userId.should.be.eql(userTest.userId);
                    done();
                });
        });

        it('it should GET no user chores in past for userId is not exist', (done) => {
            chai.request(server)
                .get('/api/chores/userChores/userId/0/future/false')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('err');
                    res.body.should.have.property('message');
                    res.body.message.should.equal('user not exist');
                    done();
                });
        });
        
        it('it should GET no user chores in future for userId that have no one', (done) => {
            chai.request(server)
                .get('/api/chores/userChores/userId/'+userTest2.userId+'/future/true')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('chores');
                    res.body.chores.should.be.a('array');
                    res.body.chores.length.should.be.eql(0);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('no usersChores for this user');
                    done();
                });
        });

        after((done) => {
            UsersChores.destroy({
                where: {
                    userId: {[Op.or]: [userTest.userId, userTest2.userId]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId]}
                }
            });
            done();
        });
    });

    //3 it
    describe('/GET users that do choretype api22', () => {
        before((done) => {
            Users.create(userTest);
            Users.create(userTest2);
            ChoreTypes.create(choreTypeTestSat);
            ChoreTypes.create(choreTypeTestFri);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestSat.choreTypeName
            });
            done();
        });

        it('it should GET the users do the specific choretype ', (done) => {
            chai.request(server)
            .get('/api/chores/type/'+choreTypeTestSat.choreTypeName+'/users')
            .end((err, res) => {
                res.should.have.status(200);
                setTimeout(function () {
                    res.body.should.have.property('usersChoreType');
                    res.body.usersChoreType.should.be.a('array');
                    res.body.usersChoreType.length.should.be.eql(1);
                    res.body.usersChoreType[0].should.have.property('choreTypeName').eql(choreTypeTestSat.choreTypeName);
                    res.body.usersChoreType[0].User.should.have.property('mailbox').eql(userTest.mailbox);
                    console.log("\n\n\nres.body.usersChoreType[0].mailbox:"+res.body.usersChoreType[0].User.mailbox+"\n\n\n")
                    done();
                }, 5000);
            });
        });
        
       it('it should GET the no users for the specific choretype that has no users', (done) => {
           chai.request(server)
           //.get('/api/chores/type/'+choreTypeTestFri.choreTypeName+'/users')
           .get('/api/chores/type/friCoocking/users')
           .end((err, res) => {
               res.should.have.status(200);
               setTimeout(function () {
                   //res.body.should.have.property('err');
                   res.body.should.have.property('message');
                   res.body.message.should.be.eql('no users for this choretype');
                   //res.body.usersChoreType.should.be.a('array');
                   //res.body.usersChoreType.length.should.be.eql(1);
                   // res.body.usersChoreType[0].should.have.property('choreTypeName').eql(choreTypeTestSat.choreTypeName);
                   // res.body.usersChoreType[0].User.should.have.property('mailbox').eql(userTest.mailbox);
                   // console.log("\n\n\nres.body.usersChoreType[0].mailbox:"+res.body.usersChoreType[0].User.mailbox+"\n\n\n")
                       done();
               }, 5000);
           });
       });

       it('it should not GET the users do the specific choretype that not exist ', (done) => {
            chai.request(server)
            .get('/api/chores/type/'+'no_such_type'+'/users')
            .end((err, res) => {
                res.should.have.status(400);
                setTimeout(function () {
                    res.body.should.have.property('err');
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('choreType is not exist');
                    //res.body.usersChoreType.should.be.a('array');
                    //res.body.usersChoreType.length.should.be.eql(1);
                    // res.body.usersChoreType[0].should.have.property('choreTypeName').eql(choreTypeTestSat.choreTypeName);
                    // res.body.usersChoreType[0].User.should.have.property('mailbox').eql(userTest.mailbox);
                    // console.log("\n\n\nres.body.usersChoreType[0].mailbox:"+res.body.usersChoreType[0].User.mailbox+"\n\n\n")
                        done();
                }, 5000);
                });
        });

    
        after((done) => {
            UsersChoresTypes.destroy({
                where: {
                choreTypeName: choreTypeTestSat.choreTypeName,
                userId: userTest.userId
                }
            });
            UsersChoresTypes.destroy({
                where: {
                choreTypeName: choreTypeTestFri.choreTypeName,
                userId: userTest2.userId
                }
            });
            Users.destroy({
                where: {
                userId: userTest.userId
                }
            });
            Users.destroy({
                where: {
                userId: userTest2.userId
                }
            });
            ChoreTypes.destroy({
                where: {
                choreTypeName: choreTypeTestSat.choreTypeName
                }
            });
            
            ChoreTypes.destroy({
                where: {
                choreTypeName: choreTypeTestFri.choreTypeName
                }
            });

            //done();
            setTimeout(function () {
                            done();
                        }, 5000);
        });
    });

    //2 it
    describe('/GET settings of choreType by choreTypeName api20', () => {
        before((done) => {
            ChoreTypes.create(choreTypeTestSat);
            done();
        });

        it('it should GET settings specific choretype ', (done) => {
            chai.request(server)
            .get('/api/chores/type/'+choreTypeTestSat.choreTypeName+'/settings')
            .end((err, res) => {
                res.should.have.status(200);
                setTimeout(function () {
                    res.body.should.have.property('type');
                    //res.body.usersChoreType.should.be.a('array');
                    //res.body.usersChoreType.length.should.be.eql(1);
                    res.body.should.have.property('message').eql('getting settings of choreType by choreTypeName seccussfully done');
                    res.body.type.should.have.property('choreTypeName').eql(choreTypeTestSat.choreTypeName);
                    done();
                }, 5000);
            });
        });

        it('it should not GET settings of not exist choretype ', (done) => {
            chai.request(server)
            .get('/api/chores/type/'+'no_such_type'+'/settings')
            .end((err, res) => {
                res.should.have.status(400);
               setTimeout(function () {
                   //res.body.should.have.property('err');
                   res.body.should.have.property('message');
                   res.body.message.should.be.eql('choreType is not exist');
                   done();
                }, 5000);
            });
        });
    
    
        after((done) => {
            UsersChoresTypes.destroy({
                where: {
                choreTypeName: choreTypeTestSat.choreTypeName,
                userId: userTest.userId
                }
            });
            UsersChoresTypes.destroy({
                where: {
                choreTypeName: choreTypeTestFri.choreTypeName,
                userId: userTest2.userId
                }
            });
            Users.destroy({
                where: {
                userId: userTest.userId
                }
            });
            Users.destroy({
                where: {
                userId: userTest2.userId
                }
            });
            ChoreTypes.destroy({
                where: {
                choreTypeName: choreTypeTestSat.choreTypeName
                }
            });
            
            ChoreTypes.destroy({
                where: {
                choreTypeName: choreTypeTestFri.choreTypeName
                }
            });

            //done();
            setTimeout(function () {
                            done();
                        }, 5000);
        });
        
    });

    //5 it
    describe('/GET userChores by userId and choreTypeName api25', () => {
        before((done) => {
            ChoreTypes.create(choreTypeTestSat);
            ChoreTypes.create(choreTypeTestFri);
            Users.create(userTest);
            Users.create(userTest2);
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

        it('it should GET all the user chores of choreType in future of the userId ', (done) => {
            chai.request(server)
                .get('/api/chores/usersChores/type/'+choreTypeTestFri.choreTypeName+'/userId/'+userTest.userId+'/future/true')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('userChores');
                    res.body.userChores.should.be.a('array');
                    res.body.userChores.length.should.be.eql(1);
                    res.body.userChores[0].choreTypeName.should.be.eql(choreTypeTestFri.choreTypeName);
                    res.body.userChores[0].userId.should.be.eql(userTest.userId);
                    done();
                });
        });

        it('it should GET all the user chores of choreType in past for that userId', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/type/'+choreTypeTestSat.choreTypeName+'/userId/'+userTest.userId+'/future/false')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('userChores');
                res.body.userChores.should.be.a('array');
                res.body.userChores.length.should.be.eql(1);
                res.body.userChores[0].choreTypeName.should.be.eql(choreTypeTestSat.choreTypeName);
                res.body.userChores[0].userId.should.be.eql(userTest.userId);
                done();
                });
        });

        it('it should not GET user chores in future for userId is not exist', (done) => {
            chai.request(server)
                .get('/api/chores/usersChores/type/'+choreTypeTestFri.choreTypeName+'/userId/'+'111111111'+'/future/true')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('err');
                    res.body.should.have.property('message');
                    res.body.message.should.equal('user not exist');
                    done();
                });
        });
        
        it('it should GET no user chores in future for userId that have no one', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/type/'+choreTypeTestFri.choreTypeName+'/userId/'+userTest2.userId+'/future/true')
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('userChores');
                    res.body.userChores.should.be.a('array');
                    res.body.userChores.length.should.be.eql(0);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('no usersChores for that user in this choretype');
                    done();
                });
        });

        it('it should not GET user chores in future for userId in type that not exist', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/type/'+'no_such_type'+'/userId/'+userTest2.userId+'/future/true')
            .end((err, res) => {
                    res.should.have.status(400);
                    //res.body.should.have.property('userChores');
                    //res.body.userChores.should.be.a('array');
                    //res.body.userChores.length.should.be.eql(0);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('choreType not exist ');
                    done();
                });
        });

        after((done) => {
            UsersChores.destroy({
                where: {
                    userId: {[Op.or]: [userTest.userId, userTest2.userId]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId]}
                }
            });
            done();
        });
    });

    //5 it
    describe('/GET userChores by month, userId and choreTypeName api7', () => {
        before((done) => {
            setTimeout(function () {
            ChoreTypes.create(choreTypeTestSat);
            ChoreTypes.create(choreTypeTestFri);
            Users.create(userTest);
            Users.create(userTest2);
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
        }, 3000);
            
        });
    
        
        it('it should GET all the user chores of choreType in month of the userId ', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/choreType/'+choreTypeTestFri.choreTypeName+'/month/12/year/2019/userId/'+userTest.userId+'')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('getting users chores for userId,type and month seccussfully done');
                    res.body.should.have.property('usersChores');
                    res.body.usersChores.should.be.a('array');
                    res.body.usersChores.length.should.be.eql(1);
                    res.body.usersChores[0].choreTypeName.should.be.eql(choreTypeTestFri.choreTypeName);
                    res.body.usersChores[0].userId.should.be.eql(userTest.userId);
                    //res.body.usersChores[0].date[5].should.be.eql('1');
                    res.body.usersChores[0].date.split('-')[1].should.be.eql('12');
                    res.body.usersChores[0].date.split('-')[0].should.be.eql('2019');
                    done();
                });
        });
            
            
        it('it should not GET user chores of choreType and user in illegal month ', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/choreType/'+choreTypeTestFri.choreTypeName+'/month/k/year/2019/userId/'+userTest.userId+'')
            .end((err, res) => {
                //setTimeout(function () {
                res.should.have.status(400);
                //res.body.should.have.property('err');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('year or month with illegal values');
                done();
                //}, 5000);
            });
        });
            

        it('it should GET user chores of choreType of not exist choretype ', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/choreType/'+'no_such_type'+'/month/12/year/2019/userId/'+userTest.userId+'')
            .end((err, res) => {
                //setTimeout(function () {
                res.should.have.status(400);
                //res.body.should.have.property('err');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('choreType is not exist');
                    done();
                //}, 7000);
            });
        });
        
       
        it('it should GET no user chores in this month and type for userId that have no one', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/choreType/'+choreTypeTestSat.choreTypeName+'/month/12/year/2019/userId/'+userTest2.userId)
            .end((err, res) => {
                //setTimeout(function () {
                    //res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('no users chores found for userId,type and month');
                    res.body.should.have.property('usersChores');
                    res.body.usersChores.should.be.a('array');
                    res.body.usersChores.length.should.be.eql(0);
                    done();
                    //}, 8000);
                });
        });

        //throw exception but all the tests pass
        it('it should not GET user chores for userId is not exist', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/choreType/'+choreTypeTestFri.choreTypeName+'/month/12/year/2019/userId/'+'111111111')
            .end((err, res) => {
                //setTimeout(function () {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.equal("userId doesn't exist!");
                    done();
                   //}, 7000);
            });
        });
      

        after((done) => {
            UsersChores.destroy({
                where: {
                    userId: {[Op.or]: [userTest.userId, userTest2.userId]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId]}
                }
            });
            done();
        });
    });

    //4 it
    describe('/GET userChores by month and choreTypeName api4', () => {
        before((done) => {
            setTimeout(function () {
            //ChoreTypes.create(choreTypeTestSat);
            ChoreTypes.create(choreTypeTestFri);
            Users.create(userTest);
            //Users.create(userTest2);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            // UsersChoresTypes.create({
            //     userId: userTest2.userId,
            //     choreTypeName: choreTypeTestFri.choreTypeName
            // });
            //UsersChores.create(userChoreTestFuture);
            UsersChores.create(userChoreTestFuture);
            done();
        }, 3000);
            
        });
    
        
        it('it should GET all the users chores of choreType in month ', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/type/'+choreTypeTestFri.choreTypeName+'/month/12/year/2019')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('getting users chores from choreType and month seccussfully done');
                    res.body.should.have.property('usersChores');
                    res.body.usersChores.should.be.a('array');
                    res.body.usersChores.length.should.be.eql(1);
                    res.body.usersChores[0].choreTypeName.should.be.eql(choreTypeTestFri.choreTypeName);
                    res.body.usersChores[0].userId.should.be.eql(userTest.userId);
                    //res.body.usersChores[0].date[5].should.be.eql('1');
                    res.body.usersChores[0].date.split('-')[1].should.be.eql('12');
                    res.body.usersChores[0].date.split('-')[0].should.be.eql('2019');
                    done();
                });
        });
            
            
        it('it should not GET user chores of choreType and user in illegal month ', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/type/'+choreTypeTestFri.choreTypeName+'/month/t/year/2019')
            .end((err, res) => {
                //setTimeout(function () {
                res.should.have.status(400);
                //res.body.should.have.property('err');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('year or month with illegal values');
                done();
                //}, 5000);
            });
        });
            

        it('it should GET user chores of choreType of not exist choretype ', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/type/'+'no_such_type'+'/month/12/year/2019')
            .end((err, res) => {
                //setTimeout(function () {
                res.should.have.status(400);
                //res.body.should.have.property('err');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('choreType is not exist');
                    done();
                //}, 7000);
            });
        });
        
       
        it('it should GET no user chores in this month and type that have no one', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/type/'+choreTypeTestFri.choreTypeName+'/month/03/year/2019')
            .end((err, res) => {
                //setTimeout(function () {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('no users chores found for choreType and month');
                    // res.body.should.have.property('usersChores');
                    // res.body.usersChores.should.be.a('array');
                    // res.body.usersChores.length.should.be.eql(0);
                    done();
                    //}, 8000);
                });
        });

        after((done) => {
            UsersChores.destroy({
                where: {
                    userId: {[Op.or]: [userTest.userId, userTest2.userId]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId]}
                }
            });
            done();
        });
    });

    //4 it
    describe('/GET userChores by month, userId  api6', () => {
        before((done) => {
            setTimeout(function () {
            ChoreTypes.create(choreTypeTestSat);
            ChoreTypes.create(choreTypeTestFri);
            Users.create(userTest);
            Users.create(userTest2);
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
        }, 3000);
            
        });
    
        
        it('it should GET all the user chores of in month of the userId ', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/month/12/year/2019/userId/'+userTest.userId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('getting users chores for userId and month seccussfully done');
                    res.body.should.have.property('usersChores');
                    res.body.usersChores.should.be.a('array');
                    res.body.usersChores.length.should.be.eql(1);
                    res.body.usersChores[0].choreTypeName.should.be.eql(choreTypeTestFri.choreTypeName);
                    res.body.usersChores[0].userId.should.be.eql(userTest.userId);
                    //res.body.usersChores[0].date[5].should.be.eql('1');
                    res.body.usersChores[0].date.split('-')[1].should.be.eql('12');
                    res.body.usersChores[0].date.split('-')[0].should.be.eql('2019');
                    done();
                });
        });
            
            
        it('it should not GET user chores of user in illegal month ', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/month/u/year/2019/userId/'+userTest.userId)
            .end((err, res) => {
                //setTimeout(function () {
                res.should.have.status(400);
                //res.body.should.have.property('err');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('year or month with illegal values');
                done();
                //}, 5000);
            });
        });
        
       
        it('it should GET no user chores in this month for userId that have no one', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/month/12/year/2019/userId/'+userTest2.userId)
            .end((err, res) => {
                //setTimeout(function () {
                    //res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('no such users chores for userId and month');
                    res.body.should.have.property('usersChores');
                    res.body.usersChores.should.be.a('array');
                    res.body.usersChores.length.should.be.eql(0);
                    done();
                    //}, 8000);
                });
        });

        //throw exception but all the tests pass
        it('it should not GET user chores for userId is not exist', (done) => {
            chai.request(server)
            .get('/api/chores/usersChores/month/12/year/2019/userId/'+'111111111')
            .end((err, res) => {
                //setTimeout(function () {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.eql('userId doesn\'t exist!');
                    done();
                   //}, 7000);
            });
        });
      

        after((done) => {
            UsersChores.destroy({
                where: {
                    userId: {[Op.or]: [userTest.userId, userTest2.userId]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId]}
                }
            });
            done();
        });
    });
 
    //5 it
    describe('/DELETE user from choreTypeName api24', () => {
        before((done) => {
            setTimeout(function () {
            ChoreTypes.create(choreTypeTestSat);
            ChoreTypes.create(choreTypeTestFri);
            Users.create(userTest);
            Users.create(userTest2);
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
        }, 3000);
    
        });

        it('it should DELETE the user from choreType', (done) => {
            chai.request(server)
                .delete('/api/chores/type/'+choreTypeTestSat.choreTypeName+'/users/userId/'+userTest.userId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('remove userId from choreType seccussfully done');
                    res.body.should.have.property('userChoreType');
                    res.body.userChoreType.should.have.property('userId').eql(userTest.userId);
                    res.body.userChoreType.should.have.property('choreTypeName').eql(choreTypeTestSat.choreTypeName);
                    done();
                });
        });

        it('it should not DELETE user from choreType if he has a future userchores', (done) => {
            chai.request(server)
            .delete('/api/chores/type/'+choreTypeTestFri.choreTypeName+'/users/userId/'+userTest.userId)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.be.eql('The user has a future userChores, cannot continue in removing from this choreType');
                done();
                });
        });

        it('it should not DELETE user from choreType when userId is not exist', (done) => {
            chai.request(server)
            .delete('/api/chores/type/'+choreTypeTestFri.choreTypeName+'/users/userId/'+'111111111')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('err');
                    res.body.should.have.property('message');
                    res.body.message.should.equal("userId doesn't exist!");
                    done();
                });
        });
        
        it('it should not DELETE user from type when userId are not belong to', (done) => {
            chai.request(server)
            .delete('/api/chores/type/'+choreTypeTestFri.choreTypeName+'/users/userId/'+userTest2.userId)
            .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('The chore type didnt found for this user');
                    done();
                });
        });

        it('it should not DELTE user from choreType that not exist', (done) => {
            chai.request(server)
            .delete('/api/chores/type/'+'no such type'+'/users/userId/'+userTest2.userId)
            .end((err, res) => {
                    res.should.have.status(400);
                    //res.body.should.have.property('userChores');
                    //res.body.userChores.should.be.a('array');
                    //res.body.userChores.length.should.be.eql(0);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('choreType is not exist');
                    done();
                });
        });

        after((done) => {
            UsersChores.destroy({
                where: {
                    userId: {[Op.or]: [userTest.userId, userTest2.userId]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId]}
                }
            });
            done();
        });
    });


    //5 it
    describe('/POST new userChore api18', () => {
        before((done) => {
            setTimeout(function () {
                ChoreTypes.create(choreTypeTestSat);
                ChoreTypes.create(choreTypeTestFri);
                Users.create(userTest);
                UsersChoresTypes.create({
                    userId: userTest.userId,
                    choreTypeName: choreTypeTestFri.choreTypeName
                });
                // UsersChores.create({
                //     userId: userChoreTestFuture.userId,
                //     choreTypeName: userChoreTestFuture.choreTypeName,
                //     date: new Date(userChoreTestFuture.date),
                //     isMark: userChoreTestFuture.isMark,
                // });
                done();
            }, 5000);

        });
    
        it('it should POST new user Chore for the user', (done) => {
            chai.request(server)
                .post('/api/chores/add/userChore')
                .send({
                    userId: userTest.userId,
                    choreTypeName: choreTypeTestFri.choreTypeName,
                    date: new Date("2019-06-30"),
                    isMark: false
                })
                .end((err, res) => {
                    //res.should.have.status(200);
                    res.body.should.have.property('message').eql('userChore successfully added!');
                    res.body.should.have.property('newUserChore');
                    res.body.newUserChore.userId.should.be.eql(userTest.userId);
                    done();
                });
        });

        it('it should faild in  POST new user Chore when the user not exist', (done) => {
            chai.request(server)
                .post('/api/chores/add/userChore')
                .send({
                    userId: '111111111',
                    choreTypeName: choreTypeTestFri.choreTypeName,
                    date: new Date("2019-06-29"),
                    isMark: false
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    //res.body.should.have.property('message').eql('userId doesn\'t exist!');
                    res.body.should.have.property('message');
                    res.body.message.should.eql("userId doesn't exist!");
                    done();
                });
        });
    
        it('it should faild in  POST new user Chore when the user not do the choreType', (done) => {
            chai.request(server)
                .post('/api/chores/add/userChore')
                .send({
                    userId: userTest.userId,
                    choreTypeName: choreTypeTestSat.choreTypeName,
                    date: new Date("2019-06-29"),
                    isMark: false
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('user not do this chore');
                    done();
                });
        });

        it('it should faild in  POST new user Chore when the date in the past', (done) => {
            chai.request(server)
                .post('/api/chores/add/userChore')
                .send({
                    userId: userTest.userId,
                    choreTypeName: choreTypeTestFri.choreTypeName,
                    date: "2016-06-29",
                    isMark: false
                })
                .end((err, res) => {
                   // res.should.have.status(400);
                    res.body.should.have.property('message').eql('Cannot schedule a user chore at a past date');
                    done();
                });
        });

        it('it should faild in  POST new user Chore when the type is not exist', (done) => {
            chai.request(server)
                .post('/api/chores/add/userChore')
                .send({
                    userId: userTest.userId,
                    choreTypeName: 'no_such_type',
                    date: "2019-06-29",
                    isMark: false
                })
                .end((err, res) => {
                   // res.should.have.status(400);
                    res.body.should.have.property('message').eql('This choreType does\'nt exist!');
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
            Users.destroy({
                where:{
                    userId: userTest.userId
                }
            });
            UsersChoresTypes.destroy({
                where:{
                    choreTypeName: choreTypeTestFri.choreTypeName
                }
            })
            ChoreTypes.destroy({
                where:{
                    choreTypeName: choreTypeTestFri.choreTypeName
                }
            })
            UsersChores.destroy({
                where:{
                    userId: userTest.userId
                }
            })
            done();
        });
    });

 
    //4 it
    describe('/DELETE user from choreTypeName api28', () => {
        before((done) => {
            setTimeout(function () {
            ChoreTypes.create(choreTypeTestSat);
            ChoreTypes.create(choreTypeTestFri);
            ChoreTypes.create(choreTypeTestSun);
            Users.create(userTest);
            Users.create(userTest2);
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
        }, 3000);
    
        });

        it('it should DELETE the choreType when no future userchore for it', (done) => {
            chai.request(server)
                .delete('/api/chores/type/'+choreTypeTestSat.choreTypeName+'/delete')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('The chore type removed successfully (with the userchores and from usrschoretypes)');
                    res.body.should.have.property('removedType').eql(1);
                    done();
                });
        });

        it('it should DELETE choreType even if has a future userchores', (done) => {
            chai.request(server)
            .delete('/api/chores/type/'+choreTypeTestFri.choreTypeName+'/delete')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message');
                res.body.message.should.be.eql('The chore type removed successfully (with the userchores and from usrschoretypes)');
                res.body.should.have.property('removedType').eql(1);
                done();
                });
        });
        
        it('it should DELETE choreType when no user belong to', (done) => {
            chai.request(server)
            .delete('/api/chores/type/'+choreTypeTestSun.choreTypeName+'/delete')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message');
                res.body.message.should.be.eql('The chore type removed successfully (with the userchores and from usrschoretypes)');
                res.body.should.have.property('removedType').eql(1);
                //res.body.removedType.should.have.property('choreTypeName').eql(choreTypeTestSun.choreTypeName);
                done();
                });
        });

        it('it should not DELTE user from choreType that not exist', (done) => {
            chai.request(server)
            .delete('/api/chores/type/'+'no such type'+'/delete')
            .end((err, res) => {
                    res.should.have.status(400);
                    //res.body.should.have.property('userChores');
                    //res.body.userChores.should.be.a('array');
                    //res.body.userChores.length.should.be.eql(0);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('choreType is not exist');
                    done();
                });
        });

        after((done) => {
            UsersChores.destroy({
                where: {
                    userId: {[Op.or]: [userTest.userId, userTest2.userId]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId]}
                }
            });
            done();
        });
    });

    //3 it
    describe('/DELETE user from choreTypeName api29', () => {
        before((done) => {
            setTimeout(function () {
            ChoreTypes.create(choreTypeTestSat);
            ChoreTypes.create(choreTypeTestFri);
            ChoreTypes.create(choreTypeTestSun);
            Users.create(userTest);
            Users.create(userTest2);
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestFri.choreTypeName
            });
            UsersChoresTypes.create({
                userId: userTest.userId,
                choreTypeName: choreTypeTestSat.choreTypeName
            });

            UsersChores.create(userChoreTestFuture)
            .then(created=>{
                choreId = created.userChoreId;
                console.log("\n\n\n1. choreId: "+choreId+"\n\n\n");    
                UsersChores.create(userChoreTestNow)
                .then(cre=>{
                    choreIdPast = cre.userChoreId;
                    console.log("\n\n\n3. choreIdpast: "+choreIdPast+"\n\n\n");    
                    done();
                }) .catch(err=>{
                    done();
                })           
            })

        }, 3000);
    
        });

        it('it should DELETE the userChore in future', (done) => {
            chai.request(server)
                .delete('/api/chores/userChoreId/'+choreId+'/delete')
                .end((err, res) => {
                    setTimeout(function () {
                    console.log("\n\n\n2. choreId: "+choreId+"\n\n\n");
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('userChore removed successfully');
                    res.body.should.have.property('deleted').eql(1);
                    done();
                }, 6000);

                });
        });

        it('it should not DELETE userchore in past', (done) => {
            chai.request(server)
            .delete('/api/chores/userChoreId/'+choreIdPast+'/delete')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.be.eql('no such userChore in the future (cannot remove userchore that already executed)');
                res.body.should.have.property('deleted').eql(0);
                done();
                });
        });
        
        it('it should not  DELETE userChore not exist', (done) => {
            chai.request(server)
            .delete('/api/chores/userChoreId/'+"0"+'/delete')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.be.eql('no such userChore in the future (cannot remove userchore that already executed)');
                res.body.should.have.property('deleted').eql(0);
                done();
                });
        });

        after((done) => {
            UsersChores.destroy({
                where: {
                    userId: {[Op.or]: [userTest.userId, userTest2.userId]}
                }
            });
            ChoreTypes.destroy({
                where: {
                    choreTypeName: {[Op.or]: [choreTypeTestSat.choreTypeName, choreTypeTestFri.choreTypeName, choreTypeTestSun.choreTypeName]}
                }
            });
            Users.destroy({
                where: {
                    userId: {[Op.or]:[userTest.userId,userTest2.userId]}
                }
            });
            done();
        });
    });

});