const bcrypt = require('bcrypt')

class Crypt {
    hashPassword(password, salt=7) {
        return bcrypt.hashSync(password, salt)
    }
    comparePasswords(commonPassword, hashedPassword) {
        return bcrypt.compareSync(commonPassword, hashedPassword)
    }
}

module.exports = new Crypt()