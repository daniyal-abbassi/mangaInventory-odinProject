const {Router} = require('express');
const categoryRouter = Router();
const categoryController = require('../controllers/categoryController');



categoryRouter.get('/',categoryController.getAllCategories); 
categoryRouter.get('/create',(req,res)=>{
    res.render('categories/create',{title: "Create Category",layout: './layouts/main'})
})
categoryRouter.get('/:id/mangas',categoryController.getCategoryMangas)
categoryRouter.post('/',categoryController.createCategory)


//others goes here : put, delete and ...

module.exports=categoryRouter;