const pool = require('../database/pool');
const Author = require('./authorModel');


const Manga = {
    getAll: async () => {
        try {
            const result = await pool.query('SELECT * FROM manga');
            return result.rows;
        } catch (error) {
            console.error(`Error in manga.getAll : ${error}`);
            throw error;
        }
    },

    create: async (title, description, release_date, image_url) => {
        try {
            const result = await pool.query('INSERT INTO manga(title,description,release_date,image_url) VALUES($1,$2,$3,$4) RETURNING *', [title, description, release_date, image_url]);
            return result.rows[0];
        } catch (error) {
            console.error(`Error in manga.create : ${error}`);
            throw error;
        }
    },

    getMangaById: async (manga_id) => {
        try {
            const result = await pool.query('SELECT * FROM manga WHERE manga_id = $1', [manga_id]);
            return result.rows[0];
        } catch (error) {
            console.error(`Error in getmangabyid: ${error}`);
            throw error;
        }
    },

    updateManga: async (manga_id, manga_data) => {
        try {
            const { title, description, release_date, image_url } = manga_data;
            const result = await pool.query('UPDATE manga SET title=$1 , description=$2, release_date=$3, image_url=$4 WHERE manga_id=$5 RETURNING *', [title, description, release_date, image_url, manga_id])
            //UPDATING AUTHOR 
            
            return result.rows[0];
        } catch (error) {
            console.error(`error in manga update mange: ${error}`);
            throw error;
        }
    },
    getAuthorsOfManga: async(manga_id) => {
        try {
            //GET AUTHORS WITH MANGA_ID
            const authorsofManga = await pool.query('SELECT author.* FROM manga INNER JOIN manga_authors USING(manga_id) INNER JOIN author USING(author_id) WHERE manga_id=$1',[manga_id]); 
            return authorsofManga.rows;
        } catch (error) {
            console.error(`Error in Manga.getAuthorOfManga: ${error}`)
            throw error;
        }
    },
    //GET CATEGORIES OF A MANGA FUNCTION
    getCategoriesOfManga: async(manga_id)=>{
        try {
            const categoriesOfManga = await pool.query('SELECT category.* FROM manga INNER JOIN manga_categories USING(manga_id) INNER JOIN category USING(category_id) WHERE manga_id=$1',[manga_id]);
            return categoriesOfManga.rows;
        } catch (error) {
            console.error(`Error in Manga.getcategoriesOfManga: ${error}`)
            throw error;
        }//try and catch block
    },//get categoriesOfManga section

    delete: async (manga_id) => {
        try {
            await pool.query('DELETE FROM manga WHERE manga_id=$1', [manga_id]);
            
        } catch (error) {
            console.error(`ERROR IN MANGA.delete: ${error}`)
            throw error;
        }
    },
    getMangasByDate: async(dateArray)=> {
        try {
            const result = await pool.query('SELECT manga.* FROM manga WHERE EXTRACT(YEAR FROM release_date)=ANY($1)',[dateArray])
            return result.rows;
        } catch (error) {
            console.error(`ERROR IN MANGA.getMangasByName: ${error}`)
            throw error;
        }
    },
    getMangaByText: async(searchStr)=>{
        try {
            const namestr = `%${searchStr}%`
            const result = await pool.query('SELECT manga.* FROM manga WHERE title ILIKE $1',[namestr]);
            return result.rows;
        } catch (error) {
            console.error(`ERROR IN MANGA.getMangaByText: ${error}`)
            throw error;
        }
    },


    //other operations for delete and update


}


module.exports = Manga;