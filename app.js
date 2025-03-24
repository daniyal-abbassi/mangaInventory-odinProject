const express = require('express');
require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');
const pool = require('./database/pool')
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({extended: true}))


app.use(express.static('public'));

app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine','ejs')




const categoryRouter = require('./routes/categoryRouter');
const mangaRouter = require('./routes/mangaRouter')
const authorRouter = require('./routes/authorRouter')


app.use('/categories',categoryRouter)
app.use('/mangas',mangaRouter)
app.use('/authors',authorRouter)
app.get('',(req,res)=>{
    res.render('mangas/index',{title: 'Manga Inventory'})
})
app.listen(PORT,()=>console.log(`server running listens on port: ${PORT}`))
