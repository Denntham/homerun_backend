const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true },
    gender: {type: String},
    bio: {type: String, required: false, default: 'Bio user ini masih kosong.'},
    phone: {type: Number, required: false},
    address: {type: String, required: false},
    city: {type: String, required: false},
    province: {type: String, required: false},
    permission: {type: Number, required: true},
    serviceType: {type: String, default: 'user'},
})

/*userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret.id;
        delete ret.passwordHash;
        delete ret._id;
    }
});*/

const User = mongoose.model("user", userSchema);

module.exports = User;