const {Router} = require('express');
const authorRouter = Router();
const authorController = require('../controllers/authorController');


authorRouter.get('/',authorController.getAllAuthors);
authorRouter.get('/create',(req,res)=>{
    res.render('authors/create' ,{title: "Creaate Author",layout: './layouts/main'})
})
authorRouter.post('/',authorController.createAuthor)
authorRouter.get('/:id/works',authorController.getAuthorsWork)
authorRouter.post('/:id/delete',authorController.deleteAuthor)
//others goes here

module.exports=authorRouter;