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
var choreId= 0;

describe('chores route', function () {
     this.timeout(20000);

    // beforeEach((done) => {
    //     setTimeout(function () {
    //         done();
    //     }, 5000);
    // });
    before(() => {
        
        return UsersChores.sync() // also tried with {force: true}
    });
 /*   
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
*/
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

            //done();
                done();
            }, 5000);
                    
        });

        it('it should GET all the user chores of choreType in month of the userId ', (done) => {
            chai.request(server)
                .get('/api/chores/usersChores/choreType/'+choreTypeTestFri.choreTypeName+'/month/12/year/2019/userId/'+userTest.userId)
                .end((err, res) => {
                    //res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('getting users chores for userId,type and month seccussfully done');
                    res.body.should.have.property('usersChores');
                    res.body.usersChores.should.be.a('array');
                    res.body.usersChores.length.should.be.eql(1);
                    res.body.usersChores[0].choreTypeName.should.be.eql(choreTypeTestFri.choreTypeName);
                    res.body.usersChores[0].userId.should.be.eql(userTest.userId);
                    res.body.usersChores[0].date.getMonth().should.be.eql(9);
                    res.body.usersChores[0].date.getYear().should.be.eql(2019);
                    done();
                });
        });
/*
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
*/
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
    
});