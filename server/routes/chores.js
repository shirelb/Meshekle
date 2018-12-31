var express = require('express');
var router = express.Router();
const {UsersChores, ChoreTypes, UsersChoresTypes, Users} = require('../DBorm/DBorm');
const validations = require('./shared/validations');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/* GET users chores listing. api1 */
router.get('/usersChores/future/:future', function (req, res, next) {
  if(req.params.future==="true"){
    UsersChores.findAll({
              where:{
                date:{
                  [Op.gte]: Date.now()
                }
              }
        })
        .then(chores => {
            console.log(chores);
            res.status(200).send(chores);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Something went wrong: ", err);
        })
  }
  else{
    UsersChores.findAll({
              where:{
                date:{
                  [Op.lte]: Date.now()
                }
              }
        })
        .then(chores => {
            console.log(chores);
            res.status(200).send(chores);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Something went wrong: "+err);
        })
  }
});

/* GET choreTypes listing api26. */
router.get('/choreTypes', function (req, res, next) {
  ChoreTypes.findAll()
      .then(chores => {
          console.log("Getting all choreTypes successfully done"+chores);
          res.status(200).send(chores);
      })
      .catch(err => {
          console.log(err);
          res.status(500).send("Something went wrong "+err);
      })
});

/* GET userChore by choreId api2. */
router.get('/userChores/userChoreId/:userChoreId', function (req, res, next) {
  UsersChores.findOne({
                  where: {
                    userChoreId: req.params.userChoreId
                  }
                })
      .then(chore => {
        if(chore){
          console.log("Getting all userChores successfully done"+chore);
          res.status(200).send({"message":"Getting usersChore by userchoreId successfully done", chore});
        } 
        else{
          res.status(400).send({"message":"userChoreId does not exist", chore});
        } 
      })
      .catch(err => {
          console.log(err);
          res.status(500).send("Something went wrong "+err);
          //res.status(400).send({"message":"userChoreId does not exist", err});
      })
});

/* GET userChores by userId api3. */
router.get('/userChores/userId/:userId/future/:future', function (req, res, next) {
  validations.checkIfUserExist(req.params.userId)
  .then(user=>{
      if(req.params.future==="true"){
        UsersChores.findAll({
                        where: {
                          userId: req.params.userId,
                          date: {
                            [Op.gte]: Date.now()//future
                          }
                        }
                      })
            .then(chores => {
              if(chores && chores.length>0){
                console.log(chores);
                 res.status(200).send({"message":'Getting usersChores for user successfully done', chores});
              }
              else{
                 res.status(200).send({"message":'no usersChores for this user', chores});
              }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send("Something went wrong "+err);
            })
      }
      else{
            UsersChores.findAll({
              where: {
                userId: req.params.userId,
                date: {
                  [Op.lte]: Date.now()//past
                }
              }
            })
        .then(chores => {
          if(chores && chores.length>0){
            console.log(chores);
            return res.status(200).send({"message":'Getting usersChores for user '+ chores.userId +' successfully done',chores});
          }
          else{
            return res.status(200).send({"message":'no usersChores for this user',chores});
          }
        })
        .catch(err => {
          console.log(err);
          res.status(500).send({"message":"Something went wrong ",err});
        })
      }
  })
  .catch(err=>{
      res.status(400).send({"message":"user not exist", err});
  });
});

/* GET settings of choreType by choreTypeName api20. */
router.get('/type/:type/settings', function (req, res, next) {
  validations.checkIfChoreTypeExist(req.params.type)
  .then(type=>{
          if(type){
            console.log('getting settings of choreType by choreTypeName seccussfully done'+type);
            res.status(200).send({"message":"getting settings of choreType by choreTypeName seccussfully done",type});
          }
          else{
            res.status(400).send({"message":"choreType is not exist",type});
          }
  })
  .catch(err=>{
    res.status(400).send({"message":"choreType is not exist", err});
  });
});

/* GET users of choreType by choreTypeName api22. */
router.get('/type/:type/users', function (req, res, next) {
  validations.checkIfChoreTypeExist(req.params.type, res)
  .then(type=>{
    console.log("\n\n\nlalalalalalala:"+type+"\n\n\n")
    if(type){
      UsersChoresTypes.findAll({ 
        include: [{model: Users}],
        where: { choreTypeName: req.params.type},
      })
          .then(usersChoreType => {
              //console.log('getting userIds of choreType by choreTypeName seccussfully done'+usersChoreType);
              if(usersChoreType && usersChoreType.length>0){
                res.status(200).send({"message":"getting users of choretype seccessfully done",usersChoreType});
              }
              else{
                res.status(200).send({"message":"no users for this choretype",usersChoreType});
              }
          })
          .catch(err => {
              console.log("\n\n\nhere\n\n\n");
              res.status(500).send({"message":"Something went wrong",err});
          })
    }
    else{
      res.status(400).send({"message":"choreType is not exist",err});
    }
  })
  .catch(err=>{
    res.status(400).send({"message":"choreType is not exist",err});
  })
});

/* GET userChores  by userId and choreTypeName api25. */
router.get('/usersChores/type/:type/userId/:userId/future/:future', function (req, res, next) {
  validations.checkIfChoreTypeExist(req.params.type)
  .then(type=>{
    if(type){
      validations.checkIfUserExist(req.params.userId)
      .then(user=>{
        if(req.params.future==="true"){
          UsersChores.findAll({
                          where: {
                            choreTypeName: req.params.type,
                            userId: req.params.userId,
                            date:{
                              [Op.gte]: Date.now()
                            }
                          }
                        })
              .then(userChores => {
                if(userChores&& userChores.length>0){
                  console.log('getting user chores of choreType seccussfully done'+userChores);
                  res.status(200).send({"message":"getting usersChores seccessfully done",userChores});
                }
                else{
                  if(userChores&& userChores.length===0)
                  res.status(200).send({"message":"no usersChores for that user in this choretype",userChores});
                }
                
              })
              .catch(err => {
                  console.log(err);
                  res.status(500).send("Something went wrong "+err);
              })
        }
        else{
            UsersChores.findAll({
              where: {
                choreTypeName: req.params.type,
                userId: req.params.userId,
                date:{
                  [Op.lte]: Date.now()
                }
              }
            })
            .then(userChores => {
              if(userChores&& userChores.length>0){
                console.log('getting user chores of choreType seccussfully done'+userChores);
                res.status(200).send({"message":"getting usersChores seccessfully done",userChores});
              }
              else{
                if(userChores&& userChores.length===0)
                res.status(200).send({"message":"no usersChores for that user in this choretype",userChores});
              }
              
            })
            .catch(err => {
            console.log(err);
            res.status(500).send({"message":"Something went wrong ",err});
            })
        }
  
      })
      .catch(err=>{
        res.status(400).send({"message":"user not exist", err});
      })
    }
    else{
      res.status(400).send({"message":"choreType not exist ", type});
    }
  })
  .catch(err=>{
    res.status(400).send({"message":"choreType not exist ",err});
  })
});

/* GET  getChoresForSpecificMonthAndForSpecificType  api4. */
router.get('/usersChores/type/:type/month/:month/year/:year', function (req, res, next) {
  validations.checkIfChoreTypeExist(req.params.type)
  .then(type=>{
    if(typeof req.params.month==='number' && req.params.month>=1 && req.params.month<=12 && typeof req.params.year==='number'){
      UsersChores.findAll({
                      where: {
                        choreTypeName: req.params.type,
                        date: {
                          [Op.gte]: new Date(req.params.year+"-"+req.params.month+"-01"),
                          [Op.lt]: new Date(req.params.year+"-"+(req.params.month+1)+"-01")
                        }
                      }
                    })
          .then(usersChores => {
              console.log('getting users chores from choreType and month seccussfully done'+usersChores);
              res.status(200).send('getting users chores from choreType and month seccussfully done'+usersChores);
          })
          .catch(err => {
              console.log(err);
              res.status(500).send("Something went wrong "+err);
          })
    }
    else{
      res.status(200).send("year or month with illegal values");
    }
  })
  .catch(err=>{
    res.status(500).send("Something went wrong "+err);
  })
});

/* GET  getChoresForSpecificMonthAndForSpecificUser  api6. */
router.get('/usersChores/month/:month/year/:year/userId/:userId', function (req, res, next) {
  validations.checkIfUserExist(req.params.userId)
  .then(user=>{
    if(typeof req.params.month==='number' && req.params.month>=1 && req.params.month<=12 && typeof req.params.year==='number'){
      UsersChores.findAll({
                      where: {
                        userId: req.params.userId,
                        date: {
                          [Op.gte]: new Date(req.params.year+"-"+req.params.month+"-01"),
                          [Op.lt]: new Date(req.params.year+"-"+(req.params.month+1)+"-01")
                        }
                      }
                    })
          .then(usersChores => {
              console.log('getting users chores for userId and month seccussfully done'+usersChores);
              res.status(200).send('getting users chores for userId and month seccussfully done'+usersChores);
          })
          .catch(err => {
              console.log(err);
              res.status(500).send("Something went wrong "+err);
          })     
    }
    else{
      res.status(200).send("year or month with illegal values");
    }
  })
  .catch(err=>{
    res.status(500).send("Something went wrong "+err);
  })
});

/* GET  getChoresForSpecificMonthAndForSpecificUserAndType  api7. */
router.get('/usersChores/choreType/:choreType/month/:month/year/:year/userId/:userId', function (req, res, next) {
  validations.checkIfUserExist(req.params.userId)
  .then(user=>{
    validations.checkIfChoreTypeExist(req.params.choreType, res)
    .then(type=>{
      if(type){
        if((typeof Numbre(req.params.month))==='number' && Numbre(req.params.month)>=1 && Numbre(req.params.month)<=12 && (typeof Numbre(req.params.month))==='number'){
          UsersChores.findAll({
                          where: {
                            userId: req.params.userId,
                            choreTypeName: req.params.choreType,
                            date: {
                              [Op.gte]: new Date(req.params.year+"-"+req.params.month+"-01"),
                              [Op.lt]: new Date(req.params.year+"-"+(Number(req.params.month)+1)+"-01")
                            }
                          }
                        })
              .then(usersChores => {
                  console.log('getting users chores for userId, type and month seccussfully done'+usersChores);
                  res.status(200).send({"message":'getting users chores for userId,type and month seccussfully done',usersChores});
              })
              .catch(err => {
                  res.status(500).send({"message":"Something went wrong ",err});
              })
        }
        else{
          res.status(400).send({"message":"year or month with illegal values"});
        }
      }
      else{
        res.status(400).send({"message":"choreType is not exist"});
      }
    })
    .catch(err=>{
      res.status(400).send({"message":"choreType is not exist",err});
    })
  })
  .catch(err=>{
    res.status(500).send({"message":"Something went wrong ",err});
  })
});

/* DELETE user from choreType  api24. */
router.delete('/type/:type/users/userId/:userId', function (req, res, next) {
  validations.checkIfChoreTypeExist(req.params.type)
  .then(type=>{
    validations.checkIfUserExist(req.params.userId)
    .then(user=>{
      UsersChoresTypes.findOne({
                      where: {
                        choreTypeName: req.params.type,
                        userId: req.params.userId
                      }
                    })
          .then(userChoreType => {
            if(userChoreType){
              userChoreType.destroy();
              console.log('remove userId from choreType seccussfully done'+userChoreType);
              res.status(200).send('remove userId from choreType seccussfully done'+userChoreType);
            }else{
              res.status(500).send("The chore type didnt found for this user");
            }
          })
          .catch(err => {
              console.log(err);
              res.status(500).send("Something went wrong "+err);
          })
    })
    .catch(err=>{
      res.status(500).send("Something went wrong "+err);
    })
  })
  .catch(err=>{
    res.status(500).send("Something went wrong "+err);
  })
});

/* POST choreType api19. */
router.post('/add/choreType', function (req, res, next) {
  validations.checkIfChoreTypeExist(req.body.choreTypeName, res)
  .then(choreType=>{
      if (choreType && choreType.dataValues && choreType.choreTypeName===req.body.choreTypeName){
        return res.status(400).send({
          "message": "This choreType allready exist!",
      });
      }
      else{ //if choreType doesnt exist
        if(!((req.body.choreTypeName && (typeof req.body.choreTypeName ==='string'))&&(req.body.days && (typeof req.body.days ==='string'))&&(req.body.numberOfWorkers && (typeof req.body.numberOfWorkers ==='number'))&&(req.body.frequency && (typeof req.body.frequency ==='number'))&&(req.body.startTime && (typeof req.body.startTime ==='string'))&&(req.body.endTime && (typeof req.body.endTime ==='string'))&&(req.body.color && (typeof req.body.color ==='string')))){
          return res.status(400).send({
            "message": "One or more field/s is in incorreck type",
        });
        }
        ChoreTypes.create({
          choreTypeName: req.body.choreTypeName,
          days: req.body.days,//JSON.stringify(req.body.days),
          numberOfWorkers: req.body.numberOfWorkers,
          frequency: req.body.frequency,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          color: req.body.color
        })
            .then(newChoreType => {
                res.status(200).send({"message": "choreType successfully added!",});
            })
            .catch(err => {
                res.status(500).send({"message": "Something went wrong  "+err,});
            })
          
      }
  }).catch(err => {
    res.status(500).send({"message": "Something went wrong  "+err});
  })
});

/* POST adding user to choreType .api23 */
router.post('/choreType/users/add/userId', function (req, res, next) {
  validations.checkIfUserExist(req.body.userId)
   .then(user=>{
    if (user.dataValues&& user.userId === req.body.userId ) {     
       validations.checkIfChoreTypeExist(req.body.choreTypeName, res)
       .then(choreType=>{
         if(choreType && choreType.dataValues && choreType.choreTypeName===req.body.choreTypeName){
           if(!((req.body.choreTypeName && (typeof req.body.choreTypeName ==='string'))&&(req.body.userId && (typeof req.body.userId ==='string')))){
             return res.status(400).send({
               "message": "One or more field/s is in incorreck type or empty",
           });
           }
           else{
             UsersChoresTypes.create({
               userId: req.body.userId,
               choreTypeName: req.body.choreTypeName
             })
                 .then(userChoreType => {
                     console.log('New user'+ userChoreType.userId+',  has been added to chore type: '+userChoreType.choreTypeName+'.\n');
                     res.status(200).send({"message": "userId successfully added to choreType!",userChoreType});
                 })
                 .catch(err => {
                     console.log("Something went wrong!"+err);
                     res.status(500).send({"message":"-Something went wrong!",err});
                 })
               }
         }
         else{
           console.log("here111111111111111");
           res.status(400).send({"message": "choreType is not exist!",userChoreType});
         }    
         }).catch(err => {
           console.log("Something went wrong!"+err);
           console.log("here2222222222222222");
           res.status(400).send({"message":"choreType is not exist!",err});
            });

     }
     else{
      //res.status(400).send({"message": "user is not exist!"});
     }

  })
  .catch(err=>{
    res.status(400).send({"message":"userId doesn't exist!",err});
  })
});


/* POST userChore api18. */
router.post('/add/userChore', function (req, res, next) {
  //*if isUserExist(req.body.userId)
  //*if isChoreTypeExist(req.body.choreTypeName)
  //*if isLegalDate(pastORfuture) // will (check if the pattern present an legal data?) + check the parameter: if is future so will chek if the date is in the future and same for past
  //if isUserNeedToDoThisChore(req.body.userId, req.body.choreTypeName) //will check if 1.this user register for this choreType. 2. no relesee for this user for this chorttype 3. check if no deviation according the his last userchore
  validations.checkIfChoreTypeExist(req.body.choreTypeName)
  .then(choreType=>{
      if (choreType){
        date = new Date(req.body.date);
        dateNow = new Date(Date.now());
        if(date<dateNow){
            console.log("\n the date in the past\n")
            return res.status(200).send({
              "message": "Cannot schedule a user chore at a past date",
            });
        }else{
          console.log("\n the date is OK!\n")
          validations.checkIfUserExist(req.body.userId, res)
          .then(user=>{
            //check if the user have releases for that chore
            if(checkIfUserDoChoreType(req.body.userId, req.body.choreTypeName, res)){
              UsersChores.create({
                userId: req.body.userId,
                choreTypeName: req.body.choreTypeName,
                date: new Date( req.body.date),
                isMark: req.body.isMark,
              })
                  .then(newUserChore => {
                      console.log('New user chore created with Id:'+ newUserChore.userChoreId+',  has been created.');
                      res.status(200).send({"message": "userChore successfully added!",newUserChore});
                  })
                  .catch(err => {
                      console.log(err);
                      res.status(500).send(err);
                  })
            }
            else{
              res.status(400).send("user not do this chore");
            }
          })
          .catch(err=>{
            res.status(500).send("Something went wrong!",err);
          })
        }
      }
      else{ //if choreType doesnt exist
        return res.status(500).send({
          "message": "This choreType does'nt exist!",
        });
        
      }
  })
});

/* PUT update settings of choreType api21. */
router.put('/type/:type/settings/set', function (req, res, next) {
  validations.checkIfChoreTypeExist(req.params.type)
  .then(type=>{
    ChoreTypes.findOne({
                    where: {
                      choreTypeName: req.params.type
                    }
                  })
        .then(choreType => {
          choreType.update({
              days: (req.body.days && (typeof req.body.days==='string')) ? req.body.days: choreType.days,//JSON.stringify(req.body.days),
              numberOfWorkers: (req.body.numberOfWorkers && (typeof req.body.numberOfWorkers==='number')) ? req.body.numberOfWorkers: choreType.numberOfWorkers,
              frequency: (req.body.frequency && (typeof req.body.frequency==='number')) ? req.body.frequency : choreType.frequency,
              startTime: (req.body.startTime && (typeof req.body.startTime==='string')) ? req.body.startTime : choreType.startTime,
              endTime: (req.body.endTime && (typeof req.body.endTime==='string')) ? req.body.endTime : choreType.endTime,
              color: (req.body.color && (typeof req.body.color==='string')) ? req.body.color : choreType.color
            
          }).then(ct => {
            console.log(ct);
            res.status(200).send(ct);
          }).catch(er => {
            console.log(er);
            res.status(500).send("Something went wrong!",err);
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })

  })
  .catch(err=>{
    res.status(500).send("Something went wrong!",err);
  })
});

checkIfUserDoChoreType = function(userId, type, res){
  return UsersChoresTypes.findOne({
    where: {
      userId:userId,
      choreTypeName:type
    }
})
    .then(userChoreType => {
        if (userChoreType) {
            return true;
        }
        else {
            return false;
        }
    })
    .catch(err => {
        return res.status(500).send({
            "message": "",
            err
        });
    })
}
module.exports = router;
