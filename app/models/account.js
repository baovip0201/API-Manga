const {model, Schema}=require('mongoose')

const accountSchema= new Schema({
    userId: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String},
    avatar: {type: String},
    bio: {type: String},
    email: {type: String, required: true, unique: true},
    role: {type: String, required: true, enum: ['admin','user'], default: 'user'},
    otp: {type: Number},
    verifyToken: {type: String},
    isVerified: {type: Boolean, default: false}
},{_id: false})


module.exports=model('Account', accountSchema)