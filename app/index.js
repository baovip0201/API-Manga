const express=require('express')
const app= express()
const connectMongo=require('../config/database')
const routerManga=require('./routes/manga')
require('dotenv').config()

connectMongo.connectDb()

app.use('/api/manga', routerManga)
app.listen(3000, () => {
    console.log('Server started on port 3000')
  });