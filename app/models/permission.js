const {model, Schema}=require('mongoose')

const permissionSchema= new Schema({
    id: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    role: {type: String, ref: 'Account', localField: 'role', foreignField: 'role', required: true},
})


module.exports=model('Permission', permissionSchema)