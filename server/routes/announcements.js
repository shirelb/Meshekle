var authentications = require('./shared/authentications');
var validations = require('./shared/validations');
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
    validations.getServiceProvidersByServProIdPromise(req.params.serviceProviderId)
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
    validations.getUsersByUserIdPromise(req.params.userId)
        .then(users => {
            if (users.length === 0) {
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
    validations.getCategoryByCategoryIdPromise(req.params.categoryId)
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
    validations.getUsersByUserIdPromise(req.params.userId)
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
    validations.getServiceProvidersByServProIdPromise(req.params.serviceProviderId)
        .then(serviceProvider => {
            if (serviceProvider.length === 0) {
                return res.status(400).send({message: announcementsRoute.SERVICE_PROVIDER_NOT_FOUND});
            }
            Announcements.findAll({
                where: {
                    serviceProviderId: parseInt(req.params.serviceProviderId)
                }
            })
                .then(announcements => {
                    console.log(announcements);
                    res.status(200).send(announcements);
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
    validations.getUsersByUserIdPromise(req.params.userId)
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
    validations.getCategoryByCategoryIdPromise(req.params.categoryId)
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
    validations.getAnnouncementByAnnounceIdPromise(req.params.announcementId)
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
    validations.getCategoryByCategoryIdPromise(req.params.categoryId)
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


// GET all requests that relevant for a specific service provider
router.get('/requests/serviceProviderId/:serviceProviderId', function (req, res, next) {
    validations.getServiceProvidersByServProIdPromise(parseInt(req.params.serviceProviderId))
        .then(serviceProvider => {
            if (serviceProvider.length === 0) {
                return res.status(400).send({"message": announcementsRoute.SERVICE_PROVIDER_NOT_FOUND});
            }
            Categories.findAll({
                where: {
                    serviceProviderId: parseInt(req.params.serviceProviderId)
                }
            })
                .then(categories => {
                    var categoriesNames = categories.map((cat) => cat.dataValues.categoryName);

                    Categories.findAll({
                        where: {
                            categoryName: {[Op.in]: categoriesNames}
                        }
                    })
                        .then(categories => {


                            var categoriesIDs = categories.map((cat) => cat.dataValues.categoryId);

                            Announcements.findAll({
                                where: {
                                    categoryId: {
                                        [Op.in]: categoriesIDs
                                    },
                                    status: constants.statueses.REQUEST_STATUS
                                }
                            })
                                .then(announcements => {
                                    console.log(announcements);
                                    res.status(200).send(announcements);
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


//GET all announcements by status sorted by creation date
router.get('/status/:status', function (req, res, next) {
    Announcements.findAll({
        where: {
            status: req.params.status
        },
        order: [['creationTime', 'DESC']]
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




//GET all categories
router.get('/categories', function (req, res, next) {
    Categories.findAll()
        .then(Categories => {
            console.log(Categories);
            res.status(200).send(Categories);
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
router.put('/update/announcementId/:announcementId', function (req, res, next) {
    validations.getAnnouncementByAnnounceIdPromise(req.params.announcementId)
    .then(response => {
        if (response.length === 0)
            return res.status(400).send({"message": announcementsRoute.ANNOUNCEMENT_NOT_FOUND});

        let updateFields = {};
        req.body.serviceProviderId ? updateFields.serviceProviderId = req.body.serviceProviderId : null;
        req.body.userId ? updateFields.userId = req.body.userId : null;
        req.body.categoryId ? updateFields.categoryId = req.body.categoryId : null;
        req.body.content ? updateFields.content = req.body.content : null;
        req.body.title ? updateFields.title = req.body.title : null;
        req.body.file ? updateFields.file = req.body.file : null;
        req.body.fileName ? updateFields.fileName = req.body.fileName : null;
        req.body.creationTime ? updateFields.creationTime = req.body.creationTime : null;

        if(req.body.status)
            if (!isStatusExists(req.body.status))
                return res.status(400).send({"message": announcementsRoute.STATUS_DOESNT_EXISTS});
            else
                updateFields.status = req.body.status;

            if (req.body.expirationTime)
            if (!validateTime(req.body.expirationTime))
                return res.status(400).send({"message": announcementsRoute.INVALID_EXP_TIME_INPUT});
            else
              updateFields.expirationTime = req.body.expirationTime;

            if (req.body.dateOfEvent && req.body.dateOfEvent !== "NaN-NaN-NaN" && req.body.dateOfEvent !== "" && !validateTime(req.body.dateOfEvent))
                return res.status(400).send({"message": announcementsRoute.INVALID_DOE_INPUT});
            else
                updateFields.dateOfEvent = req.body.dateOfEvent;

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
        title: req.body.title,
        content: req.body.content,
        expirationTime: req.body.expirationTime,
        file: req.body.file,
        fileName: req.body.fileName,
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


// ADD category subscription
router.post('/subscription/add', function (req, res, next) {

    validations.getUsersByUserIdPromise(req.body.userId)
    .then(users => {
            if(users.length === 0)
                return res.status(400).send({message: announcementsRoute.USER_NOT_FOUND});
        validations.getCategoryByCategoryIdPromise(req.body.categoryId)
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





// DELETE category subscription
router.put('/subscription/delete', function (req, res, next) {
    AnnouncementSubscriptions.destroy(
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



// update category subscription
router.post('/subscription/update', function (req, res, next) {

    validations.getUsersByUserIdPromise(req.body.userId)
        .then(users => {
            if(users.length === 0)
                return res.status(400).send({message: announcementsRoute.USER_NOT_FOUND});
            validations.getCategoriesPromise()
                .then(categories => {
                    categories = categories.map(c => c.categoryId);
                    req.body.categories.map(cat => {
                        if(!categories.includes(cat.categoryId))
                            return res.status(400).send({message: announcementsRoute.CATEGORY_NOT_FOUND});
                    });
                    AnnouncementSubscriptions.destroy(
                        {
                            where: {
                                userId: req.body.userId,
                            }
                        })
                        .then(() => {
                            AnnouncementSubscriptions.bulkCreate(
                                req.body.categories.filter(c => c.switch).map(item => {return {userId: req.body.userId, categoryId: item.categoryId}})
                            ).then(updated =>
                                res.status(200).send({
                                    "message": announcementsRoute.SUB_UPDATED_SUCC,
                                    "result": updated
                                }))
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



// add announcement category
router.post('/categories/add', function (req, res, next) {

    validations.getCategoriesPromise()
        .then(categories =>
        {
            let catNames=categories.map((cat) => cat.dataValues.categoryName.toLowerCase());
            if(catNames.includes(req.body.categoryName.toLowerCase()))
                return res.status(400).send({"message": announcementsRoute.CATEGORY_ALREADY_EXISTS});

            validations.getServiceProvidersByServiceProviderIdsPromise(req.body.managers.map(item =>item.serviceProviderId))
                .then(serviceProviders => {
                    if(serviceProviders.length !== req.body.managers.length)
                        return res.status(400).send({message: announcementsRoute.SERVICE_PROVIDER_NOT_FOUND});
                    Categories.findAll(
                        {
                            where: {
                                categoryName: req.body.categoryName,
                                serviceProviderId: {
                                    [Op.in]: req.body.managers.map(item =>item.serviceProviderId)
                                },
                            }
                        })
                        .then(categories => {
                            if (categories.length > 0) {
                                return res.status(400).send({message: announcementsRoute.CATEGORY_ALREADY_EXISTS});
                            }
                            req.body.managers.push({serviceProviderId:"1"});
                            Categories.bulkCreate(
                                req.body.managers.map(item => {return {categoryName: req.body.categoryName, serviceProviderId: item.serviceProviderId}})

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

        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })

});






// update category
router.post('/categories/update', function (req, res, next) {
    validations.getCategoriesPromise()
        .then(categories => {
            let catNames = categories.map((cat) => cat.dataValues.categoryName.toLowerCase());

            // checks if the user want to change category name to an already existing one
            if (req.body.categoryName.toLowerCase() !== req.body.categoryOldName.toLowerCase() && catNames.includes(req.body.categoryName.toLowerCase()))
                return res.status(400).send({"message": announcementsRoute.CATEGORY_ALREADY_EXISTS});

            // checks if he want to update category that doesnt exists
            if(!catNames.includes(req.body.categoryOldName.toLowerCase()))
                return res.status(400).send({"message": announcementsRoute.CATEGORY_DOESNT_EXISTS});

            validations.getServiceProvidersByServiceProviderIdsPromise(req.body.managers.map(item =>item.serviceProviderId))
                .then(serviceProviders => {
                    if(serviceProviders.length !== req.body.managers.length)
                        return res.status(400).send({message: announcementsRoute.SERVICE_PROVIDER_NOT_FOUND});

                    // if (!isCategoryExists(req.body.categoryName))
                    //     return res.status(400).send({"message": announcementsRoute.CATEGORY_DOESNT_EXISTS});
                    Categories.findAll({
                        where:{
                            categoryName: req.body.categoryOldName,
                        }
                    })
                        .then((categories)=> {
                            const removedCategoriesList = categories.map((cat) => cat.dataValues.categoryId);
                            Categories.destroy(
                                {
                                    where: {
                                        categoryName: req.body.categoryOldName,
                                    }
                                })
                                .then(() => {
                                    req.body.managers.push({serviceProviderId: "1"});
                                    Categories.bulkCreate(
                                        req.body.managers.map(item => {
                                            return {
                                                categoryName: req.body.categoryName,
                                                serviceProviderId: item.serviceProviderId
                                            }
                                        })
                                    ).then(updated =>{
                                        Categories.findAll({
                                            where: {
                                                categoryName: req.body.categoryName,
                                                serviceProviderId: 1
                                            }
                                        })
                                            .then((categories) => {
                                                const adminCategoryId = categories.map((cat) => cat.dataValues.categoryId)[0];
                                                Announcements.update(
                                                    {categoryId: adminCategoryId},
                                                    {
                                                        where: {
                                                            categoryId: {[Op.in]: removedCategoriesList}
                                                        }
                                                    }

                                                )
                                                    .then(()=> {
                                                        AnnouncementSubscriptions.update(
                                                            {categoryId: adminCategoryId},
                                                            {
                                                                where: {
                                                                    categoryId: {[Op.in]: removedCategoriesList}
                                                                }
                                                            }

                                                        )
                                                            .then(()=> {

                                                                res.status(200).send({
                                                                    "message": announcementsRoute.CATEGORY_UPDATED_SUCC,
                                                                    "result": updated
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

        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })

});






// DELETE announcement category.
router.put('/categories/delete/categoryName/:categoryName', function (req, res, next) {
    Categories.destroy(
        {
            where: {
                categoryName: req.params.categoryName,
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





function validateTime(expirationTime) {
    let today = new Date();
    let toCheck= new Date(expirationTime);
    return toCheck >= today;
}

function isLegalTime(expirationTime) {
    let regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!expirationTime.match(regEx)) return false;  // Invalid format
    let d = new Date(expirationTime);
    if(Number.isNaN(d.getTime())) return false; // Invalid date
    return d.toISOString().slice(0,10) === expirationTime;
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

    if(!isLegalTime(announcementInput.expirationTime))
        return announcementsRoute.ILLEGAL_EXP_TIME_INPUT;
    if (!validateTime(announcementInput.expirationTime))
        return announcementsRoute.INVALID_EXP_TIME_INPUT;

    if(announcementInput.dateOfEvent && announcementInput.dateOfEvent !== "NaN-NaN-NaN" && announcementInput.dateOfEvent !== "") {
        if (!isLegalTime(announcementInput.dateOfEvent))
            return announcementsRoute.ILLEGAL_DOE_INPUT;
        if (!validateTime(announcementInput.dateOfEvent))
            return announcementsRoute.INVALID_DOE_INPUT;
    }

    if (!isStatusExists(announcementInput.status))
        return announcementsRoute.STATUS_DOESNT_EXISTS;

    return "";
}




let takeValues = (dic) => {
    return Object.keys(dic).map(function (key) {
        return dic[key];
    });
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
module.exports = router;
