const express=require('express')
const app= express()
const connectMongo=require('../config/database')
const routerManga=require('./routes/manga')
const routerGenre=require('./routes/genre')
const routerAccount=require('./routes/account')

require('dotenv').config()

connectMongo.connectDb()


app.use('/api/manga', routerManga)
app.use('/api/genre', routerGenre)
app.use('/api/account', routerAccount)



app.listen(3000, () => {
    console.log('Server started on port 3000')
  });