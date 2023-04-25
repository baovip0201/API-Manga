const express=require('express')
const app= express()
const connectMongo=require('../config/database')
const routerManga=require('./routes/manga')
const routerGenre=require('./routes/genre')
const routerAccount=require('./routes/account')
const routerComment=require('./routes/comment')
const routerChapter=require('./routes/chapter')
const routerFavorite=require('./routes/favorite')
const routerPermission=require('./routes/permission')
const routerRating=require('./routes/rating-manga')

require('dotenv').config()
const path=require('path')

connectMongo.connectDb()

// app.use(express.static(path.join(__dirname, 'downloads')))

// app.get('/api/avatar', function(req, res) {
//   const imageName = req.query.q;
//   res.sendFile(path.join(__dirname,imageName));
// });

app.use('/api/manga', routerManga)
app.use('/api/genre', routerGenre)
app.use('/api/account', routerAccount)
app.use('/api/comment', routerComment)
app.use('/api/chapter', routerChapter)
app.use('/api/favorite', routerFavorite)
app.use('/api/permission', routerPermission)
app.use('/api/rating', routerRating)


app.listen(3000, () => {
    console.log('Server started on port 3000')
  });