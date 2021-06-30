var mongoose = require('mongoose');
var schema = mongoose.Schema;
var user = new schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String
        },
        password: {
            type: String
        },
        image: {
            type: String
        },
        accessToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

var Users = mongoose.model('users', user);

module.exports = {
    Users
}