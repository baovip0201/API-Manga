const {model, Schema, default: mongoose}=require('mongoose')

const resetPasswordSchema= new Schema({
    userId: {type: mongoose.Types.ObjectId, required: true, ref: 'Account'},
    token: {type: String, required: true},
    expires: {type: Date, required: true}
})


module.exports=model('ResetPasswordToken', resetPasswordSchema)