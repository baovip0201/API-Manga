const {model, Schema}=require('mongoose')

const resetPasswordSchema= new Schema({
    userId: {type: String, required: true, ref: 'Account', localField: 'userId', foreignField: 'userId'},
    token: {type: String, required: true},
    expires: {type: Date, required: true}
})


module.exports=model('ResetPasswordToken', resetPasswordSchema)