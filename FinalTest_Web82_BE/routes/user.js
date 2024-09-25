const userController = require("../controllers/user");
const router = require("express").Router();
const jwtCheckMiddleware = require('../middleware/middleware').jwtCheckMiddleware;

router.post('/api/v1/user/login',  (req, res) => userController.loginUser(req, res));
router.post('/api/v1/user/logout', jwtCheckMiddleware, (req, res) => userController.logoutUser(req, res));

router.post('/api/v1/user/registDefaultUser',  (req, res) => {
    if(userController.registerDefaultAccout() === true) {
        res.status(201).send({
            message:"Create default user success. Please userName, password on env file",
        })
    } else {
        res.status(400).send({
            message:"Create default user fail. Default user existed",
        })
    }
});

module.exports = router
