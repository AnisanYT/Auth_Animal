const moongose = require('mongoose')
const Users = moongose.model('User', {
    email: {type: String, required: true, minLength: 5},
    password: {type: String, required: true},
    salt: {type: String, required: true},
})

module.exports = Users