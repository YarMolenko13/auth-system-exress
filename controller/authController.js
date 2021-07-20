const User = require('./../model/User')
const Role = require('./../model/Role')
const crypt = require('./../crypt/Crypt')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const {secret} = require('./../config')

const generateAccessToken = (id, roles) => {
    // прячем информацию в jwt token
    const payload = {
        id, roles
    }
    return jwt.sign(payload, secret, {expiresIn: '24h'})
}

class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Registration failed", errors})
            }
            // диструктуризация
            const {username, password, isAdmin} = req.body
            const condidate = await User.findOne({username})
            if (condidate) {
                return res.status(400).json({message: 'User with this username already exists'})
            }
            const hashedPassword = crypt.hashPassword(password)
            let userRole
            if (isAdmin) {
                userRole = await Role.findOne({value: 'ADMIN'})
            } else {
                userRole = await Role.findOne({value: 'USER'})
            }
            const user = new User({username, password: hashedPassword, roles: [userRole.value]})
            await user.save()
            await res.json({message: 'Registration successful'})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }
    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: `User ${username} is not found`})
            }
            const isPasswordValid = crypt.comparePasswords(password, user.password)
            if (!isPasswordValid) {
                return res.status(400).json({message: `Password is invalid`})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }
    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {

        }
    }
}

module.exports = new AuthController()