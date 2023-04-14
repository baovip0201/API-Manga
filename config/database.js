const mongoose=require('mongoose')

module.exports={
    connectDb: async()=>{
        try {
            const connectMongo =await mongoose.connect(process.env.MONGO_DB, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                keepAlive: true,
                connectTimeoutMS: 5000 
              });
              
            if(connectMongo){
                console.log("Đã kết nối MongoDB")
            }
        } catch (error) {
            console.error(error)
        }
    }
}