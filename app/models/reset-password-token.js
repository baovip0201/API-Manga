const {model, Schema}=require('mongoose')

const resetPasswordSchema= new Schema({
    username: {type: String, required: true, ref: 'Account'},
    token: {type: String, required: true},
    expires: {type: Date, required: true}
})


module.exports=model('ResetPasswordToken', resetPasswordSchema)