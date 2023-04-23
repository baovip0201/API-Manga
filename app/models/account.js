const {model, Schema}=require('mongoose')

const accountSchema= new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String},
    avatar: {type: String},
    bio: {type: String},
    email: {type: String, required: true},
    role: {type: String, required: true, enum: ['admin','user'], default: 'user'}
})


module.exports=model('Account', accountSchema)