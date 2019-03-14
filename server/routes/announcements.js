var authentications = require('./shared/authentications');
var validiation = require('./shared/validations');
var helpers = require('./shared/helpers');
var constants = require('./shared/constants');
var announcementsRoute = constants.announcementsRoute;
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');


const Sequelize = require('sequelize');
const {ServiceProviders, Users,Announcements,AnnouncementSubscriptions,Categories} = require('../DBorm/DBorm');
const Op = Sequelize.Op;




router.use(function (req, res, next) {
    authentications.verifyToken(req, res, next);
});

router.post('/validToken', function (req, res) {
    res.status(200).send({
        message: constants.usersRoute.VALID_TOKEN,
        payload: req.decoded.payload
    });
});



// GET all announcements
router.get('/', function (req, res, next) {
    Announcements.findAll()
        .then(Announcements => {
            console.log(Announcements);
            res.status(200).send(Announcements);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});


// GET all announcements categories that a specific service provider responsible for
router.get('/categories/serviceProviderId/:serviceProviderId', function (req, res, next) {
    ServiceProviders.findAll({
        where: {
            serviceProviderId: req.params.serviceProviderId
        }
    })
        .then(serviceProvider => {
            if (serviceProvider.length === 0) {
                return res.status(400).send({"message": announcementsRoute.SERVICE_PROVIDER_NOT_FOUND});
            }
            Categories.findAll({
                where: {
                    serviceProviderId: req.params.serviceProviderId
                }
            })
                .then(categories => {
                    console.log(categories);
                    res.status(200).send(categories);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        })
    .catch(err => {
        console.log(err);
        res.status(500).send(err);
    })
});


// GET all subscription of a specific user
router.get('/subscription/userId/:userId', function (req, res, next) {
    Users.findAll({
        where: {
            userId: req.params.userId
        }
    })
        .then(serviceProvider => {
            if (serviceProvider.length === 0) {
                return res.status(400).send({message: announcementsRoute.USER_NOT_FOUND});
            }
            AnnouncementSubscriptions.findAll({
                attributes: ['categoryId'],
                where: {
                    userId: req.params.userId
                }
            })
                .then(categories => {
                    const categoriesList = categories.map((cat) => cat.dataValues.categoryId);
                    console.log(categoriesList);
                    res.status(200).send(categoriesList);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});


// GET all expired announcements
router.get('/expired', function (req, res, next) {
    Announcements.findAll({
        where: {
            expirationTime: {
                [Op.lt]: new Date()
            }
        }
    })
        .then(Announcements => {
            console.log(Announcements);
            res.status(200).send(Announcements);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});


// GET all announcements of a specific category
router.get('/categoryId/:categoryId', function (req, res, next) {
    Categories.findAll({
        where: {
            categoryId: req.params.categoryId
        }
    })
        .then(categories => {
            if (categories.length === 0) {
                return res.status(400).send({message: announcementsRoute.CATEGORY_NOT_FOUND});
            }
            Announcements.findAll({
                where: {
                    categoryId: req.params.categoryId
                }
            })
                .then(Announcements => {
                    console.log(Announcements);
                    res.status(200).send(Announcements);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })

        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })

});



// GET all announcements of a specific user
router.get('/userId/:userId', function (req, res, next) {
    Users.findAll({
        where: {
            userId: req.params.userId
        }
    })
        .then(users => {
            if (users.length === 0) {
                return res.status(400).send({message: announcementsRoute.USER_NOT_FOUND});
            }
            Announcements.findAll({
                where: {
                    userId: req.params.userId
                }
            })
                .then(Announcements => {
                    console.log(Announcements);
                    res.status(200).send(Announcements);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })

        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })

});




// GET all announcements of a specific service provider
router.get('/serviceProviderId/:serviceProviderId', function (req, res, next) {
    ServiceProviders.findAll({
        where: {
            serviceProviderId: req.params.serviceProviderId
        }
    })
        .then(serviceProvider => {
            if (serviceProvider.length === 0) {
                return res.status(400).send({message: announcementsRoute.SERVICE_PROVIDER_NOT_FOUND});
            }
            Announcements.findAll({
                where: {
                    serviceProviderId: req.params.serviceProviderId
                }
            })
                .then(Announcements => {
                    console.log(Announcements);
                    res.status(200).send(Announcements);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })

        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })

});



// GET all announcements of a specific user with a specific status
router.get('/userId/:userId/status/:status', function (req, res, next) {
    Users.findAll({
        where: {
            userId: req.params.userId
        }
    })
        .then(users => {
            if (users.length === 0) {
                return res.status(400).send({message: announcementsRoute.USER_NOT_FOUND});
            }
            Announcements.findAll({
                where: {
                    userId: req.params.userId,
                    status: req.params.status
                }
            })
                .then(Announcements => {
                    console.log(Announcements);
                    res.status(200).send(Announcements);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })

        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })

});

// GET all announcements of a specific category with a specific status
router.get('/categoryId/:categoryId/status/:status', function (req, res, next) {
    Categories.findAll({
        where: {
            categoryId: req.params.categoryId
        }
    })
        .then(categories => {
            if (categories.length === 0) {
                return res.status(400).send({message: announcementsRoute.CATEGORY_NOT_FOUND});
            }
            Announcements.findAll({
                where: {
                    categoryId: req.params.categoryId,
                    status: req.params.status
                }
            })
                .then(Announcements => {
                    console.log(Announcements);
                    res.status(200).send(Announcements);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })

        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })

});


//Get announcement by announcement ID
router.get('/announcementId/:announcementId', function (req, res, next) {
    Announcements.findAll({
        where: {
            announcementId: req.params.announcementId
        }
    })
        .then(announcements => {
            if (announcements.length === 0) {
                return res.status(400).send({message: announcementsRoute.ANNOUNCEMENT_NOT_FOUND});
            }
            console.log(announcements);
            res.status(200).send(announcements);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});


// GET all users that subscribe for a specific category
router.get('/subscription/categoryId/:categoryId', function (req, res, next) {
    Categories.findAll({
        where: {
            categoryId: req.params.categoryId
        }
    })
        .then(categories => {
            if (categories.length === 0) {
                return res.status(400).send({message: announcementsRoute.CATEGORY_NOT_FOUND});
            }
            AnnouncementSubscriptions.findAll({
                attributes: ['userId'],
                where: {
                    categoryId: req.params.categoryId
                }
            })
                .then(users => {
                    const usersList = users.map((user) => user.dataValues.userId);
                    console.log(usersList);
                    res.status(200).send(usersList);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

// DELETE announcement by announcementId.
router.put('/delete/announcementId/:announcementId', function (req, res, next) {
    Announcements.destroy(
        {
            where: {
                announcementId: req.params.announcementId
            }
        })
        .then(numOfDeletes => {
            if (numOfDeletes === 0) {
                return res.status(400).send({"message": announcementsRoute.ANNOUNCEMENT_NOT_FOUND});
            }
            res.status(200).send({"message": announcementsRoute.ANNOUNCEMENT_DELETED_SUCC, "result": numOfDeletes});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});




// update announcement by announcementId.
router.put('update/announcementId/:announcementId', function (req, res, next) {
    validations.getAnnouncementByAnnounceIdPromise(req.params.announcementId)
        .then(response => {
            if (response.length === 0)
                return res.status(400).send({"message": announcementsRoute.ANNOUNCEMENT_NOT_FOUND});


            let updateFields = {};
            req.body.serviceProviderId ? updateFields.serviceProviderId = req.body.serviceProviderId : null;
            req.body.userId ? updateFields.userId = req.body.userId : null;
            req.body.categoryId ? updateFields.categoryId = req.body.categoryId : null;
            req.body.content ? updateFields.content = req.body.content : null;
            req.body.image ? updateFields.image = req.body.image : null;
            req.body.dateOfEvent ? updateFields.dateOfEvent = req.body.dateOfEvent : null;

            if (req.body.expirationTime)
                if (!validateExpirationTime(req.body.expirationTime))
                    return res.status(400).send({"message": announcementsRoute.INVALID_EXP_TIME_INPUT});
                else
                  updateFields.expirationTime = req.body.expirationTime;

            Announcements.update(
                updateFields,
                {
                    where: {
                        announcementId: req.params.announcementId
                    }
                })
                .then(isUpdated => {
                    if (isUpdated[0] === 0)
                        return res.status(400).send({"message": announcementsRoute.ANNOUNCEMENT_NOT_FOUND});
                    res.status(200).send({
                        "message": announcementsRoute.ANNOUNCEMENT_UPDATE_SUCCESS,
                        "result": isUpdated[0]
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        });
});


// update announcement status by announcementId.
router.put('update/announcementId/:announcementId/status/:status', function (req, res, next) {
    validations.getAnnouncementByAnnounceIdPromise(req.params.announcementId)
        .then(response => {
            if (response.length === 0)
                return res.status(400).send({"message": announcementsRoute.ANNOUNCEMENT_NOT_FOUND});

            if (!isStatusExists(req.params.status))
                return res.status(400).send({"message": announcementsRoute.STATUS_DOESNT_EXISTS});

            Announcements.update(
                {status:req.params.status},
                {
                    where: {
                        announcementId: req.params.announcementId
                    }
                })
                .then(isUpdated => {
                    if (isUpdated[0] === 0)
                        return res.status(400).send({"message": announcementsRoute.ANNOUNCEMENT_NOT_FOUND});
                    res.status(200).send({
                        "message": announcementsRoute.ANNOUNCEMENT_STATUS_UPDATE_SUCCESS,
                        "result": isUpdated[0]
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        });
});



//Add announcement
router.post('/add', function (req, res, next) {
    let isInputValid = isAnnouncementInputValid(req.body);
    if (isInputValid !== '')
        return res.status(400).send({"message": isInputValid});
    Announcements.create({
        serviceProviderId: req.body.serviceProviderId,
        userId: req.body.userId,
        categoryId: req.body.categoryId,
        creationTime: req.body.creationTime,
        content: req.body.content,
        expirationTime: req.body.expirationTime,
        image: req.body.image,
        dateOfEvent: req.body.dateOfEvent,
        status: req.body.status,
    })
        .then(newAnnouncement => {
            res.status(200).send({
                "message": announcementsRoute.ANNOUNCEMENT_ADDED_SUCC,
                "result": newAnnouncement.dataValues
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});


// add category subscription
router.put('/subscription/add', function (req, res, next) {

    Users.findAll(
        {
            where: {
                userId: req.body.userId
            }
        }).then(users => {
            if(users.length === 0)
                return res.status(400).send({message: announcementsRoute.USER_NOT_FOUND});
        Categories.findAll(
            {
                where: {
                    categoryId: req.body.categoryId
                }
            })
            .then(categories => {
                if (categories.length === 0) {
                    return res.status(400).send({message: announcementsRoute.CATEGORY_NOT_FOUND});
                }
                AnnouncementSubscriptions.findAll(
                    {
                        where: {
                            userId: req.body.userId,
                            categoryId: req.body.categoryId
                        }
                    }
                ).then(subs=>{
                    if(subs.length>0)
                        return res.status(400).send({message: announcementsRoute.SUB_ALREADY_EXISTS});
                    AnnouncementSubscriptions.create(
                        {
                            userId: req.body.userId,
                            categoryId: req.body.categoryId
                        }
                    ).then(newSub => {
                        res.status(200).send({
                            "message": announcementsRoute.SUB_ADDED_SUCC,
                            "result": newSub.dataValues
                        });

                    })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send(err);
                        })
                })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send(err);
                    })

            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })

});





// DELETE announcement subscriptions.
router.put('/subscription/delete', function (req, res, next) {
    Announcements.destroy(
        {
            where: {
                userId: req.body.userId,
                categoryId: req.body.categoryId
            }
        })
        .then(numOfDeletes => {
            if (numOfDeletes === 0) {
                return res.status(400).send({"message": announcementsRoute.SUB_NOT_FOUND});
            }
            res.status(200).send({"message": announcementsRoute.SUB_DELETED_SUCC, "result": numOfDeletes});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});








// add announcement category
router.put('/categories/add', function (req, res, next) {
    if (!isCategoryExists(req.body.categoryName))
        return res.status(400).send({"message": announcementsRoute.CATEGORY_DOESNT_EXISTS});
    ServiceProviders.findAll(
        {
            where: {
                serviceProviderId: req.body.serviceProviderId
            }
        }).then(serviceProviders => {
        if(serviceProviders.length === 0)
            return res.status(400).send({message: announcementsRoute.SERVICE_PROVIDER_NOT_FOUND});
        Categories.findAll(
            {
                where: {
                    categoryName: req.body.categoryName,
                    serviceProviderId: req.body.serviceProviderId
                }
            })
            .then(categories => {
                if (categories.length > 0) {
                    return res.status(400).send({message: announcementsRoute.CATEGORY_ALREADY_EXISTS});
                }
                Categories.create(
                    {
                        categoryName: req.body.categoryName,
                        serviceProviderId: req.body.serviceProviderId
                    }
                ).then(newCat => {
                    res.status(200).send({
                        "message": announcementsRoute.CATEGORY_ADDED_SUCC,
                        "result": newCat.dataValues
                    });
                })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send(err);
                    })

            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            })
    })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })

});


// DELETE announcement category.
router.put('/categories/delete/categoryId/:categoryId', function (req, res, next) {
    Announcements.destroy(
        {
            where: {
                categoryId: req.params.categoryId,
            }
        })
        .then(numOfDeletes => {
            if (numOfDeletes === 0) {
                return res.status(400).send({"message": announcementsRoute.CATEGORY_NOT_FOUND});
            }
            res.status(200).send({"message": announcementsRoute.CATEGORY_DELETED_SUCC, "result": numOfDeletes});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});





function validateExpirationTime(expirationTime) {
    let today = new Date();
    return expirationTime >= today;
}
//TODO: complete this function
function isLegalExpirationTime(expirationTime) {
    return true;
}

function isStatusExists(statusToCheck) {
    let statueses = takeValues(constants.statueses);
    return statueses.includes(statusToCheck)
}

function isCategoryExists(categoryToCheck) {
    let categories = takeValues(constants.categories);
    return categories.includes(categoryToCheck)
}

function isAnnouncementInputValid(announcementInput) {

    if(!isLegalExpirationTime(announcementInput.expirationTime))
        return announcementsRoute.ILLEGAL_EXP_TIME_INPUT;
    if (!validateExpirationTime(announcementInput.expirationTime))
        return announcementsRoute.INVALID_APP_WAY_TYPE_INPUT;
    if (!isStatusExists(announcementInput.status))
        return announcementsRoute.INVALID_ROLE_INPUT;

    return '';
}




let takeValues = (dic) => {
    return Object.keys(dic).map(function (key) {
        return dic[key];
    });
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
module.exports = router;
