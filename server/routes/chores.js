var express = require('express');
var router = express.Router();
const {UsersChores, ChoreTypes, UsersChoresTypes, Users, SwapRequests, Events} = require('../DBorm/DBorm');
const validations = require('./shared/validations');
const authentications = require('./shared/authentications');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var constants = require('./shared/constants');


router.use(function (req, res, next) {
  authentications.verifyToken(req, res, next);
});

// router.post('/validToken', function (req, res) {
//   res.status(200).send({
//       message: constants.usersRoute.VALID_TOKEN,
//       payload: req.decoded.payload
//   });
// });

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
            res.status(500).send( err);
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
        if(req.params.future==="false")
        {
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
      else{
        UsersChores.findAll({
          where: {
            userId: req.params.userId,
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
    if(type){
      if((typeof Number(req.params.month))==='number' && Number(req.params.month)>=1 && Number(req.params.month)<=12 && (typeof Number(req.params.year))==='number'){
        UsersChores.findAll({
                        include: [{model: Users}],
                        where: {
                          choreTypeName: req.params.type,
                          /*date: {
                            [Op.gte]: new Date(req.params.year+"-"+req.params.month+"-01"),
                            [Op.lt]: new Date(req.params.year+"-"+(Number(req.params.month)+1)+"-01")
                          }*/
                        }
                      })
            .then(usersChores => {
              if(usersChores && usersChores.length>0){
                console.log("\n\n\napi4 usersChores:", usersChores);
                res.status(200).send({"message":'getting users chores from choreType and month seccussfully done',usersChores});
              }
              else{
                res.status(200).send({"message":'no users chores found for choreType and month',usersChores});
              }
            })
            .catch(err => {
                res.status(200).send({"message":"no users chores found for choreType and month",err});
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
    res.status(500).send({"message":"choreType is not exist",err});
  })
});

/* GET  getChoresForSpecificMonthAndForSpecificUser  api6. */
router.get('/usersChores/month/:month/year/:year/userId/:userId', function (req, res, next) {
  validations.checkIfUserExist(req.params.userId)
  .then(user=>{
    if((typeof Number(req.params.month))==='number' && Number(req.params.month)>=1 && Number(req.params.month)<=12 && (typeof Number(req.params.year))==='number'){
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
            if(usersChores && usersChores.length>0){
              console.log('getting users chores for userId and month seccussfully done'+usersChores);
              res.status(200).send({"message":'getting users chores for userId and month seccussfully done',usersChores});
            }
            else{
              res.status(200).send({"message":'no such users chores for userId and month',usersChores});
            }
          })
          .catch(err => {
              console.log(err);
              res.status(200).send({"message":"no such users chores for userId and month",err});
          })     
    }
    else{
      res.status(400).send({"message":"year or month with illegal values"});
    }
  })
  .catch(err=>{
    res.status(400).send({"message":"userId doesn't exist!",err});
  })
});

/* GET  getChoresForSpecificMonthAndForSpecificUserAndType  api7. */
router.get('/usersChores/choreType/:choreType/month/:month/year/:year/userId/:userId', function (req, res, next) {
  validations.checkIfUserExist(req.params.userId, res)
  .then(user=>{
    //if(user.dataValues){
      validations.checkIfChoreTypeExist(req.params.choreType, res)
      .then(type=>{
        if(type.dataValues){
          if((typeof Number(req.params.month))==='number' && Number(req.params.month)>=1 && Number(req.params.month)<=12 && (typeof Number(req.params.month))==='number'){
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
                  if(usersChores && usersChores.length>0){
                    res.status(200).send({"message":'getting users chores for userId,type and month seccussfully done',usersChores});
                  }
                  else{
                    res.status(200).send({"message":'no users chores found for userId,type and month',usersChores});
                  }
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

    //}
    //else{
      //res.status(400).send({"message": "userId doesn't exist!"});
    //}
  })
  .catch(err=>{
    res.status(400).send({'message': constants.usersRoute.USER_NOT_FOUND ,err});//if it un-note it trow exeption but all tests pass
  })
});

/* DELETE user from choreType  api24. */
router.delete('/type/:type/users/userId/:userId', function (req, res, next) {
  validations.checkIfChoreTypeExist(req.params.type)
  .then(type=>{
    if(type){
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
                //
                UsersChores.findAll({
                  where:{
                    choreTypeName: req.params.type,
                    userId: req.params.userId,
                    date: {[Op.gt]: Date.now()}
                  }
                })
                .then(futureUserChores=>{
                  if(futureUserChores && futureUserChores.length>0){
                    res.status(400).send({"message":"The user has a future userChores, cannot continue in removing from this choreType"});
                  }
                  else{
                    userChoreType.destroy();
                    res.status(200).send({"message":'remove userId from choreType seccussfully done',userChoreType});
                  }
                })
                //
              }else{
                res.status(400).send({"message":"The chore type didnt found for this user"});
              }
            })
            .catch(err => {
                console.log(err);
                res.status(400).send({"message":"The chore type didnt found for this user"});
            })
      })
      .catch(err=>{
        res.status(400).send({"message":"userId doesn't exist!",err});
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
        if(!((req.body.choreTypeName && (typeof req.body.choreTypeName ==='string'))&&(req.body.serviceProviderId )&&(req.body.days && (typeof req.body.days ==='string'))&&(req.body.numberOfWorkers && (typeof req.body.numberOfWorkers ==='number'))&&(req.body.frequency && (typeof req.body.frequency ==='number'))&&(req.body.startTime && (typeof req.body.startTime ==='string'))&&(req.body.endTime && (typeof req.body.endTime ==='string'))&&(req.body.color && (typeof req.body.color ==='string')))){
          return res.status(400).send({
            "message": "One or more field/s is in incorreck type",
        });
        }
        ChoreTypes.create({
          choreTypeName: req.body.choreTypeName,
          serviceProviderId: req.body.serviceProviderId,
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
  //NH-if isUserNeedToDoThisChore(req.body.userId, req.body.choreTypeName) //will check if 1.this user register for this choreType. 2. no relesee for this user for this chorttype 3. check if no deviation according the his last userchore
  validations.checkIfChoreTypeExist(req.body.choreTypeName, res)
  .then(choreType=>{
      if (choreType){
        let frequency = choreType.frequency; 
        date = new Date(req.body.date);
        dateNow = Date.now();
        //if(Date(req.body.date)<Date.now()){
        if(date<dateNow){
            res.status(400).send({
              "message": "Cannot schedule a user chore at a past date",
            });
        }else{
          console.log("\n the date is OK!\n")
          validations.checkIfUserExist(req.body.userId, res)
          .then(user=>{
            //check if the user have releases for that chore
            checkIfUserDoChoreType(req.body.userId, req.body.choreTypeName, res)
            .then(ans=>{
              if(ans){
                //check if the last userchore was far enough:
                //console.log("\n\n\nbringing max date\n\n\n");
                // UsersChores.findAll({
                //   //limit: 1,
                //   where: {
                //     userId: req.body.userId,
                //     choreTypeName: req.body.choreTypeName,
                //     [Op.and]:
                //       [{date: {[Op.gte]: (new Date(req.body.date)-((-7*1)*23*59*59*1000))}} ,
                //        {date: {[Op.lte]: (new Date(req.body.date)-((7*1)*23*59*59*1000))}}]
                //     }
                  
                //   //order: [['date','DESC']],
                // })
                // .then(chore=>{
                  //consule.log("\n\n\nmax userchore: "+((new Date(req.body.date))-(7*frequency)*24*59*59*1000)+"\n\n\n");
                  // if(chore && chore.date>Date.now()){
                  //   res.status("400").send({"message":"the user allready have chore of this type in future"});
                  // }
                  // else{
                    // if(chore && (Date(req.body.date)-chore.date)/7<frequency){
                    //   console.log("\n\n\nreq.body.date-chore.date: "+req.body.date-chore.date+"\n\n\n");
                    //   res.status(400).send({"message":"this user did that chore no long ago"})
                    // }
                    // else{
                      //everything ok and create a userchore
                      UsersChores.create({
                        userId: req.body.userId,
                        choreTypeName: req.body.choreTypeName,
                        date: new Date( req.body.date),
                        originDate: new Date( req.body.date),
                        isMark: req.body.isMark,
                      })
                          .then(newUserChore => {
                              res.status(200).send({"message": "userChore successfully added!",newUserChore});
                          })
                          .catch(err => {
                              console.log(err);
                              res.status(500).send(err);
                          })
                    }
                    
                 // }
              //   })
              //   .catch(err=>{
              //       //no userchore in db so its ok to create one
              //       console.log("\n\n\nno userchore in db so its ok to create one\n\n\n")
              //       UsersChores.create({
              //         userId: req.body.userId,
              //         choreTypeName: req.body.choreTypeName,
              //         date: new Date( req.body.date),
              //         isMark: req.body.isMark,
              //       })
              //           .then(newUserChore => {
              //             console.log("\n\n\nuserchoreadded:"+newUserChore.userChoreId+"\n\n\n");
    
              //               res.status(200).send({"message": "userChore successfully added!",newUserChore});
              //           })
              //           .catch(err => {
              //               console.log(err);
              //               res.status(500).send(err);
              //           })
              //   })
              // }
              else{
                res.status(400).send({"message":"user not do this chore"});
              }
            })
            .catch(err=>{
              //res.status(400).send({"message":"user not do this chore"});
            })
              //
          })
          .catch(err=>{
            res.status(400).send({"message":constants.usersRoute.USER_NOT_FOUND,err});
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
  ChoreTypes.findOne({
                  where: {
                    choreTypeName: req.params.type
                  }
                })
      .then(choreType => {
        if(choreType){
          choreType.update({
              days: (req.body.days && (typeof req.body.days==='string')) ? req.body.days: choreType.days,//JSON.stringify(req.body.days),
              numberOfWorkers: (req.body.numberOfWorkers && (typeof req.body.numberOfWorkers==='number')) ? req.body.numberOfWorkers: choreType.numberOfWorkers,
              frequency: (req.body.frequency && (typeof req.body.frequency==='number')) ? req.body.frequency : choreType.frequency,
              startTime: (req.body.startTime && (typeof req.body.startTime==='string')) ? req.body.startTime : choreType.startTime,
              endTime: (req.body.endTime && (typeof req.body.endTime==='string')) ? req.body.endTime : choreType.endTime,
              color: (req.body.color && (typeof req.body.color==='string')) ? req.body.color : choreType.color
            
          }).then(ct => {
            console.log(ct);
            res.status(200).send({"message":"choreType updated successfully", ct});
          }).catch(er => {
            console.log(er);
            res.status(500).send("Something went wrong!",err);
            })
        }
        else{
          res.status(400).send({"message":"choreType is not exist"});
        }
  })
});

/* DELETE  choreType  api28. */
router.delete('/type/:type/delete', function (req, res, next) {
  validations.checkIfChoreTypeExist(req.params.type)
  .then(type=>{
    if(type){
        UsersChoresTypes.destroy({
                        where: {
                          choreTypeName: req.params.type
                        }
                      })
            .then(userChoreType => {
                UsersChores.destroy({
                  where:{
                    choreTypeName: req.params.type,
                    date: {[Op.gt]: Date.now()}
                  }
                })
                .then(futureUserChores=>{
                  ChoreTypes.destroy({
                    where:{
                      choreTypeName: req.params.type,
                    }
                  })
                  .then(removedType=>{
                    res.status(200).send({"message":"The chore type removed successfully (with the userchores and from usrschoretypes)", removedType});
                  })
                  .catch(err=>{
                    res.status(500).send({"message":"Something went wrong"});
                  })
                })
            })
            .catch(err => {
                res.status(400).send({"message":"Something went wrong"});
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

/* DELETE  userChore  api29. */
router.delete('/userChoreId/:userChoreId/delete', function (req, res, next) {
  UsersChores.destroy({
    where:{
      userChoreId: req.params.userChoreId,
      [Op.and]: {date: {[Op.gt]:Date.now()}},
    }
  })
  .then(deleted=>{
    if(deleted===1){
        //iteration2 : delete all replacement requests!!
        res.status(200).send({"message":"userChore removed successfully",deleted});
    }
    else{
      res.status(400).send({"message":"no such userChore in the future (cannot remove userchore that already executed)",deleted});
    }
  })
  .catch(err=>{
    res.status(400).send({"message":"no such userChore in the future (cannot remove userchore that already executed)"});
  })
});

//api 9
router.get('/replacementRequests/status/:status', function (req, res, next) {
  SwapRequests.findAll({ 
    where:{
      status: req.params.status,
    },
        include:[{all:true, nested: true}]//{model: UsersChores }],
      })
          .then(requests => {
              //console.log('getting userIds of choreType by choreTypeName seccussfully done'+usersChoreType);
              if(requests && requests.length>0){
                res.status(200).send({"message":"getting requests of replacements seccessfully done",requests});
              }
              else{
                res.status(200).send({"message":"no requests for this choretype",requests});
              }
          })
          .catch(err => {
              console.log("\n\n\nhere\n\n\n");
              res.status(500).send(err);
          })
 
});

//api 12
router.post('/replacementRequests/specificRequest', function (req, res, next) {
  //TODO: check if the useschores are in the future
  //TODO: check if the useschores are in the same type
  validations.checkIfUserChoreExist(req.body.choreIdOfSender, res)
  .then(choreSender=>{
      if (choreSender){
        validations.checkIfUserChoreExist(req.body.choreIdOfReceiver, res)
        .then(choreReceiver=>{
          if(choreReceiver){
            date = new Date(choreSender.dataValues.date);
            dateNow = Date.now();
            if(date<dateNow){
                res.status(400).send({
                  "message": "לא ניתן לבקש החלפה עם תורנות עם תאריך בעבר",
                });
            }
            else{
              console.log("create new specific request:", choreReceiver.dataValues.choreTypeName, choreSender.dataValues.choreTypeName)
              if(choreReceiver.dataValues.choreTypeName===choreSender.dataValues.choreTypeName){
              //
              SwapRequests.create({
                choreIdOfSender: req.body.choreIdOfSender,
                choreIdOfReceiver: req.body.choreIdOfReceiver,
                status: req.body.status,
              })
                  .then(newRequest => {
                      res.status(200).send({"message": "replacement request successfully added!",newRequest});
                  })
                  .catch(err => {
                      console.log(err);
                      res.status(500).send(err);
                  })
                  //
                }
                else{
                  res.status(400).send({"message": "לא ניתן לבקש החלפה בין 2 תורנויות מסוגים שונים"});
                }
            }
          }
          else{
            res.status(200).send({"message": "תורנות של מבקש הבקשה לא קיימת!",newRequest});
           } 
        })
        .catch(err=>{
          res.status(500).send({
                  "message": "שגיאה!",
                });
        })
        //date = new Date(req.body.date);
        //dateNow = Date.now();
        //if(date<dateNow){
        //    res.status(400).send({
        //      "message": "Cannot schedule a user chore at a past date",
        //    });
        //}else{
        //  console.log("\n the date is OK!\n")
        //  validations.checkIfUserExist(req.body.userId, res)
        //  .then(user=>{
            //check if the user have releases for that chore
        //    checkIfUserDoChoreType(req.body.userId, req.body.choreTypeName, res)
        //    .then(ans=>{
        //      if(ans){
                      
             
      }
       else{
        res.status(200).send({"message": "תורנות של שולח הבקשה לא קיימת!",newRequest});
       } 
      
  })
});
//api11
router.put('/replacementRequests/generalRequest', function (req, res, next) {
  //done: check if the useschores are in the future
  validations.checkIfUserChoreExist(req.body.userChoreId, res)
  .then(choreSender=>{
      if (choreSender){
            date = new Date(choreSender.dataValues.date);
            dateNow = Date.now();
            if(date<dateNow){
                res.status(400).send({
                  "message": "לא ניתן לבקש החלפה של תורנות עם תאריך בעבר",
                });
            }
            else{
              console.log("create new general request:", choreSender.dataValues.choreTypeName)
              //
              UsersChores.findOne({
                where: {
                  userChoreId: req.body.userChoreId
                }
              })
              .then(userchore=>{
                userchore.update({
                  isMark: req.body.isMark,
                })
                    .then(newRequest => {
                        res.status(200).send({"message": "general replacement request successfully added!",newRequest});
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send(err);
                    })
              })
              
                  //
            }
        
        //date = new Date(req.body.date);
        //dateNow = Date.now();
        //if(date<dateNow){
        //    res.status(400).send({
        //      "message": "Cannot schedule a user chore at a past date",
        //    });
        //}else{
        //  console.log("\n the date is OK!\n")
        //  validations.checkIfUserExist(req.body.userId, res)
        //  .then(user=>{
            //check if the user have releases for that chore
        //    checkIfUserDoChoreType(req.body.userId, req.body.choreTypeName, res)
        //    .then(ans=>{
        //      if(ans){
                      
             
      }
       else{
        res.status(200).send({"message": "תורנות של שולח הבקשה לא קיימת!"});
       } 
      
  })
});

//api10
router.put('/replacementRequests/changeStatus', function (req, res, next) {
            SwapRequests.findOne({
                where: {
                  choreIdOfSender: req.body.choreIdOfSender,
                  choreIdOfReceiver: req.body.choreIdOfReceiver,
                }
              })
              .then(userchore=>{
                userchore.update({
                  status: req.body.status,
                })
                    .then(newRequest => {
                        res.status(200).send({"message": "change status replacement request successfully done!",newRequest});
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send(err);
                    })
              })
              
});
//api13
router.put('/replacementRequests/replace', function (req, res, next) {
        UsersChores.findOne({
            where: {
              userChoreId: req.body.choreIdOfSender,
            }
          })
          .then(userchoreSender=>{
            let oldDateSender = userchoreSender.dataValues.date;
            console.log("replace sender: ", userchoreSender );
            UsersChores.findOne({
              where: {
                userChoreId: req.body.choreIdOfReceiver,
              }
            })
            .then(userchoreReceiver=>{
              let oldDateReceiver = userchoreReceiver.dataValues.date;
              userchoreReceiver.update({
                date: oldDateSender,
              })
                  .then(choreRec => {
                    userchoreSender.update({
                      date: oldDateReceiver,
                    })
                    .then(choreSen=>{
                      res.status(200).send({"message": "change dates of receiver and sender chore replacement request successfully done!",choreRec, choreSen});
                    })
                    .catch(err=>{
                      res.status(500).send(res);
                    })
                  })
                  .catch(err => {
                      console.log(err);
                      res.status(500).send(err);
                  })
            })
           /* userchore.update({
              status: req.body.status,
            })
                .then(newRequest => {
                    res.status(200).send({"message": "change status replacement request successfully done!",newRequest});
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })*/
          })              

});

/* POST event userChore (related to api18). */
  router.post('/add/event/userChore', function (req, res, next) {
            console.log("\n the date is OK!\n")
            validations.checkIfUserExist(req.body.userId, res)
            .then(user=>{
                if(user){
                        Events.create({
                          userId: req.body.userId,
                          eventType: req.body.eventType,
                          eventId: req.body.eventId,
                        })
                            .then(newEvent => {
                                res.status(200).send({"message": "event successfully added!",newEvent});
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).send(err);
                            })
                      }
                
                else{
                  res.status(400).send({"message":"user not do this chore"});
                }
              
            })
            .catch(err=>{
              res.status(404).send({"message":constants.usersRoute.USER_NOT_FOUND,err});
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
