const Manga = require('../models/mangaModel');
const Category = require('../models/categoryModel');
const Author = require('../models/authorModel');
const axios = require('axios');

const mangaController = {
    getAllMangas: async (req, res) => {
        try {
            //get queries(mangas,authors, categories) from request(for search functionality)
            let { authors, categories, relaseDate, search } = req.query;

            let mangas;
            let searchedQuery;
            //if there was authors and categories in the query, filter mangas base on them.
            if (authors && Array.isArray(authors)) {
                const authorsArray = authors.map(authorStr => Number(authorStr));
                searchedQuery = await Author.getAuthorsNamesById(authorsArray);

                //define mangas with pre-defined Author model
                mangas = await Author.getMangasByauthorArray(authorsArray);
                //define mangas with pre-defined Category model
            } else if (categories && Array.isArray(categories)) {
                const categoriesArray = categories.map(categoryStr => Number(categoryStr))
                searchedQuery = await Category.getCategoriesNamesById(categoriesArray);
                mangas = await Category.getMangasByCategoriesArray(categoriesArray);

            } else if (relaseDate && Array.isArray(relaseDate)) {
                const releaseDatsArray = relaseDate.map(dateStr => Number(dateStr));
                searchedQuery = releaseDatsArray;
                mangas = await Manga.getMangasByDate(releaseDatsArray)

            } else if (search && search.trim() !== "") {

                searchedQuery = [search];
                mangas = await Manga.getMangaByText(search);

            } else {
                //else if there was not queries, mangas should be all of mangas 
                mangas = await Manga.getAll();
            }


            let authorsNames = await Author.getAll();
            let categoriesNames = await Category.getAll();
            let mangaYears = await Manga.getAll();

            res.render('mangas/index', { searchedQuery, mangaYears, mangas, authorsNames, categoriesNames, title: "Manga Imventory", layout: './layouts/main' })
        } catch (error) {
            console.error(`Error while getting all mangas ${error}`)
            res.status(500).send('Server Error')
        }
    },

    createMangaGet: async (req, res) => {
        const categories = await Category.getAll();
        res.render('mangas/create', { categories, title: "Create Manga", layout: './layouts/main' })   //for multiple categories
    },


    createManga: async (req, res) => {
        try {
            const { title, description, release_date, image_url } = req.body;
                       
            const newManga = await Manga.create(title, description, release_date, image_url);
            //handle authors and add to author and juction table
            const manga_id = newManga.manga_id;
            const { authors } = req.body;
            if (authors && Array.isArray(authors)) {
                for (const author of authors) {
                    //check if author is valid
                    if (author) {
                        let name = await Author.getAuthorByName(author);
                        if (!name) {
                            await Author.create(author);
                        }
                        let { author_id } = await Author.getId(author);
                        await Author.addToJunctionTable(manga_id, author_id)
                    }//if author section

                }
            }
            //handle categories and add to juction table
            const { categories } = req.body;
            if (categories && Array.isArray(categories)) {
                for (const category of categories) {
                    //if category is valid
                    if (category) {
                        let name = await Category.getCategoryByName(category);
                        if (!name) {
                            await Category.create(category);
                        }
                        let { category_id } = await Category.getId(category);
                        await Category.addToJunctionTable(manga_id, category_id)
                    }
                }
            }
            res.redirect('/mangas')
        } catch (error) {
            console.error(`Error while creating manga : ${error}`)
            res.status(500).send('Server Error')
        }
    },
    //SHOULD PASS AUTHORS AND CATEGORIES TO MANGA UPDATE TO EDIT THEM TOO
    mangaUpdateGet: async (req, res) => {
        try {
            const manga = await Manga.getMangaById(req.params.id);
            //get authors for that specific manga(manga_id)
            const authors = await Manga.getAuthorsOfManga(req.params.id);
            //get categories gor that specific manga(manga_id)
            const categories = await Manga.getCategoriesOfManga(req.params.id);
            res.render('mangas/update', { manga, authors, categories, title: "Update Manga", layout: './layouts/main' })

        } catch (error) {
            console.error(`error in mangaUpdateGet controller: ${error}`)
            res.status(500).send(`error in update get controller: ${error}`);
        }
    },
    mangaUpdataePost: async (req, res) => {
        try {
            const manga_data = req.body;
            await Manga.updateManga(req.params.id, manga_data);
            const authors = req.body.authors;
            for (const author of authors) { //adding authors       
                if (author) {
                    let authorName = await Author.getAuthorByName(author);
                    if (!authorName) {
                        await Author.create(author);
                        let { author_id } = await Author.getId(author)
                        await Author.addToJunctionTable(req.params.id, author_id)
                    }
                }
            }
            //get old categories
            const oldCategories = await Manga.getCategoriesOfManga(req.params.id);
            //get new Categories
            const categories = req.body.categories;
            //check if a category is deleted lately
            for (const oldCategory of oldCategories) {
                let { name } = oldCategory;
                if (!categories.includes(name)) {
                    //get id of that deleted category
                    let { category_id } = oldCategory;
                    //delete that category from juction table
                    await Category.deleteFromJunction(req.params.id, category_id)
                }//if categories.include section                
            }//for oldCategories


            //add categories to database
            for (const category of categories) {
                //check if there is value in category
                if (category.trim() !== "") {
                    //get category name , see if its already there or not
                    let category_name = await Category.getCategoryByName(category)
                    //if not yet in categories, insert it to category table first
                    if (!category_name) {
                        await Category.create(category)
                        //get id of the new category
                        let { category_id } = await Category.getId(category)
                        //add to juction table
                        await Category.addToJunctionTable(req.params.id, category_id)
                    }//if section(!category_name)

                }//if section

            }//for section
            res.redirect('/mangas')
        } catch (error) {
            console.error(`error in mangaUpdate post: ${error}`)
            res.status(500).send(`error in mangaUpdatePst Controller: ${error}`)

        }
    },
    //more here for delete and update
    deleteManga: async (req, res) => {
        try {
            //TEST HERE 
            const authorsOfManga = await Manga.getAuthorsOfManga(req.params.id);
            for (const author of authorsOfManga) {
                const { author_id } = author;
                const mangas = await Author.getMangas(author_id);
                if (mangas.length === 1) {
                    await Author.deleteFromAuthors(author_id)
                }
            } //for author
            const categoriesOfManga = await Manga.getCategoriesOfManga(req.params.id)
            for (const category of categoriesOfManga) {
                const { category_id } = category;
                const mangas = await Category.getMangas(category_id);
                if (mangas.length === 1) {
                    await Category.deleteFromCategories(category_id);
                }
            } // for cateegory
            await Manga.delete(req.params.id);
            res.redirect('/mangas')
        } catch (error) {
            console.error(`Error in deleteManga : ${error}`)
            res.status(500).send(`server error, deleting manga`)
        }
    },

    showMangaGet: async (req, res) => {
        try {
            const manga = await Manga.getMangaById(req.params.id);
            //get authors for that specific manga(manga_id)
            const authors = await Manga.getAuthorsOfManga(req.params.id);
            //get categories gor that specific manga(manga_id)
            const categories = await Manga.getCategoriesOfManga(req.params.id);

            res.render('mangas/show', { manga, authors, categories, title: "Show Manga", layout: './layouts/main' })
        } catch (error) {

        }
    },

}

module.exports = mangaController;