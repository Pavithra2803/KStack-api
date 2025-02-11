const mongoose = require('mongoose');
//Node module which provides methods to hash password
const crypto = require('crypto');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            max: 12,
            unique: true,
            index: true,
            lowercase: true
        },
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        hashed_password: {
            type: String,
            required: true
        },
        //It is basically the strength ie. how strong the hashing should be
        salt: String,
        role: {
            type: String,
            default: 'subscriber'
        },
        resetPasswordLink: {
            data: String,
            default: ''
        },
        categories: [
            {
                type: ObjectId,
                ref: 'Category',
                required: true
            }
        ]
    },
    { timestamps: true }
);
//timestamps is the 2nd argument and it automatically gives created at and update at date in db

// virtual fields(We get the original password and hash it)
userSchema
    .virtual('password')
    .set(function(password) {
        // create temp variable called _password
        this._password = password;
        // generate salt
        this.salt = this.makeSalt();
        // encrypt password
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

// methods -> authenticate, encryptPassword, makeSalt
userSchema.methods = {
    //To encrypt the incoming password so as to check if both(entered one and the one in db) are same
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },

    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
};
// export user model

module.exports = mongoose.model('User', userSchema);
