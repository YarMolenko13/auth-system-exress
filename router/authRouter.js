const Router = require('express')
const router = new Router()
const controller = require('./../controller/authController')
const {check} = require('express-validator')
const authMiddleware = require('./../middleware/authMiddleware')
const roleMiddleware = require('./../middleware/roleMiddleware')


router.post('/registration', [
    check('username', 'Username must be not empty').notEmpty(),
    check('password', 'Password must be longer than 4 chars and shorter than 15').isLength({min:4, max: 15})
], controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)

module.exports = router