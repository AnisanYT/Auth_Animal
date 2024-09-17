const mongoose = require('mongoose')

const Animal = mongoose.model('Animal', {
    name: {type: String, required: true, minlength: 3, maxlength: 20},
    type: {type: String, required: true, minlength: 3, maxlength: 15},
})

module.exports = Animal