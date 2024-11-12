const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const UserSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    BookList:[
         {
           bookIds:{type: String}
         }
    ]
})

const UserModel = model('User', UserSchema);
module.exports = UserModel; 