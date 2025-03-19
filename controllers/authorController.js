const Author = require('../models/authorModel');



const authorController = {
    getAllAuthors: async(req,res)=>{
        try {
            const authors = await Author.getAuthorsWithManga();
            const authorsWithNoManga = await Author.getAuthorsWithoutManga();
            
            res.render('authors/index',{authorsWithNoManga,authors, title: "Authors",layout: './layouts/main'})
        } catch (error) {
            console.error(`Error while getting all authors: ${error}`);
            res.status(500).send('Server Error')
        }
    },

    createAuthor: async(req,res)=> {
        try {
            const {name} = req.body;
            const newAuthor = await Author.create(name);
            res.redirect('/authors')
        } catch (error) {
            console.error(`Error while creating author: ${error}`);
            res.status(500).send('Server Error!')
        }
    },
    


    getAuthorsWork: async(req,res)=> {
        try {
            const {id} = req.params;
            const mangas =  await Author.getMangas(id);
            const authors = await Author.getAuthorById(id);
            res.render('authors/authorsMangas',{mangas,authors, title: "Authors's Manga",layout: './layouts/main'})          
        } catch (error) {
            console.error(`Error getting authorsMangas: ${error}`)
            res.status(500).send(`Error getting Mangas: ${error}`)
        }
    },
    deleteAuthor: async(req,res)=>{
        try {
            const {id} = req.params;
            const authorMangas = await Author.getMangas(id);
            const manga_id = req.query.manga_id;
            if(authorMangas.length===1) { //delete only if the author has one manga
                await Author.deleteFromAuthors(id)
            } else {
                await Author.deleteFromJunction(manga_id,id) //delete from juctiontable 
            }
            res.redirect(`/mangas/${manga_id}/update`)
        } catch (error) {
            console.error(`Error in authorController.deleteAuthor: ${error}`)
            res.status(500).send(`serverError in authorController.deleteAuthor: ${error}`)
        }
    }
};

module.exports=authorController;