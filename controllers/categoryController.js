const Category = require('../models/categoryModel');



const categoryController = {
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.getCategoriesWithManga();
            const categoriesWithNoManga = await Category.getCategoriesWithoutManga();

            res.render('categories/index', { categoriesWithNoManga,categories, title: "Categories",layout: './layouts/main' })
        } catch (error) {
            console.error(`Error while getting all categories: ${error}`);
            res.status(500).send('server error')
        }
    },

    createCategory: async (req, res) => {
        try {
            const { name } = req.body;
            const newCategory = await Category.create(name);
            res.redirect('/categories')
        } catch (error) {
            console.error(`Error while cereating category: ${error}`)
            res.status(500).send('server error')
        }
    },
    getCategoryMangas: async(req,res)=>{
        try {
            const mangas = await Category.getMangas(req.params.id);
            const categoryName = await Category.getCategoryById(req.params.id);
            res.render('categories/showMangas',{mangas,categoryName, title: "Category's manga",layout: './layouts/main'})
        } catch (error) {
            console.error(`Error in CategoryController.getCategoryManga: ${error}`)
            res.status(500).send(`Error in CategoryController.getCategoryManga: ${error}`)
        }
    }

    //more here
}

module.exports = categoryController