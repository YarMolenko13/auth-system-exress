const jwt = require("jsonwebtoken");
const {secret} = require("./../config");

module.exports = (roles) => {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }

        try {
            // проверка на наличие токена
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(400).json({message: 'No token'})
            }
            // декодируем из JWT токена список ролей пользователя
            const {roles:userRoles} = jwt.verify(token, secret)
            let hasRole = false
            // проверяем содержит ли массив ролей пользовотеля хотя бы одну разрешенную роль
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true
                }
            })
            if (!hasRole) {
                return res.status(400).json({message: 'You have not access'})
            }
            next()
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: 'User is not auth'})
        }
    }
}