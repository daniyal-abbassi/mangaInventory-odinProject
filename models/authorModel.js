const pool = require('../database/pool');


const Author = {
    getAll: async() => {
        try {
            const result = await pool.query('SELECT * FROM author');
            return result.rows;
        } catch (error) {
            console.error(`Error is author.getAll: ${error}`)
            throw error;
        }
    },
    getAuthorsWithoutManga: async() => {
        try {
            const result = await pool.query(' SELECT author.* FROM author LEFT JOIN manga_authors USING(author_id) WHERE manga_authors.author_id IS NULL');
            return result.rows;
        } catch (error) {
            console.error(`ERROR IN Author.getAuthorsWithoutMangas: ${error}`)
            throw error;
        }
    },
    getAuthorsWithManga: async() => {
        try {
            const result = await pool.query('SELECT DISTINCT author.* FROM author RIGHT JOIN manga_authors USING(author_id)  WHERE manga_authors.author_id IS NOT NULL');
            return result.rows;      
        } catch (error) {
            console.error(`ERROR IN Author.getAuthorsWithManga: ${error}`)
            throw error;
        }
    },
    create: async(name) => {
        try {
            const result = await pool.query('INSERT INTO author(name) VALUES($1) RETURNING *',[name]);
            return result.rows[1];
        } catch (error) {
            console.error(`Error in author.create : ${error}`);
            throw error;
        }
    },
    getAuthorByName: async(name) => {
        try{
        const  result = await pool.query('SELECT name FROM author WHERE name=$1',[name]);
            
        return result.rows[0]
    } catch (error) {
        console.error(`error while getting author.getAuthorByName: ${error}`);
        throw error;
    }
},
    getAuthorById: async(author_id) => {
        try {
            const result = await pool.query('SELECT name FROM author WHERE author_id=$1',[author_id]);
            return result.rows[0];
        } catch (error) {
            console.error(`error while getting author.getAuthorById: ${error}`);
            throw error;
        }
    },
    getAuthorsNamesById: async(authorsIdsArray) => {
        try {
            const result = await pool.query('SELECT * FROM author WHERE author_id=ANY($1)',[authorsIdsArray]);
            return result.rows;
        } catch (error) {
            console.error(`ERROR IN Author.getAuthorsNamesById: ${error}`);
            throw error;
        }
    },
    addToJunctionTable: async(manga_id,author_id)=> {
        try {
            
                await pool.query('INSERT INTO manga_authors(manga_id,author_id) VALUES($1,$2)',[manga_id,author_id])
        } catch (error) {
            console.error(`error in adding to juctionTable manga_authors: ${error}`)
            throw error;
        }
    },
    getId: async(name) => {
        try {
            const  result = await pool.query('SELECT author_id FROM author WHERE name=$1',[name]);
            
            return result.rows[0]
        } catch (error) {
            console.error(`error while getting author.getID: ${error}`);
            throw error;
        }
    },
    getMangas: async(author_id) => {
        try {
            const result = await pool.query('SELECT * FROM manga_authors INNER JOIN manga USING(manga_id) INNER JOIN author USING(author_id) WHERE author_id=$1',[author_id]);
            return result.rows;
        } catch (error) {
            console.error(`error while getting author.getmangas: ${error}`);
            throw error;
        }
    },
    getMangasByAuthorName: async(name) => {
        try {
            const result = await pool.query('SELECT * FROM manga_authors INNER JOIN manga USING(manga_id) INNER JOIN author USING(author_id) WHERE name=$1',[name]);
            return result.rows[0]
        } catch (error) {
            console.error(`error while getting author.getmangasByName: ${error}`);
            throw error;
        }
    },
    getMangasByauthorArray: async(authors)=>{
        try {
            const result = await pool.query('SELECT DISTINCT manga.* FROM manga JOIN manga_authors ON manga.manga_id = manga_authors.manga_id WHERE manga_authors.author_id = ANY($1)',[authors]);
            return result.rows;
        } catch (error) {
            console.error(`error while getting author.getMangasByAuthorsArray: ${error}`);
            throw error;
        }
    },
    updateAuthor: async(author_id,name)=>{
        try {
            const result = await pool.query('UPDATE TABLE author SET')
        } catch (error) {
            
        }
    },
    deleteFromAuthors: async(author_id)=>{
        try {
             await pool.query('DELETE FROM author WHERE author_id=$1',[author_id])
        } catch (error) {
            console.error(`Error in Author.delete: ${error}`)
            throw error;
        }
    },
    deleteFromJunction: async(manga_id,author_id)=>{
        try {
             await pool.query('DELETE FROM manga_authors WHERE manga_id=$1 AND author_id=$2',[manga_id,author_id]);
        } catch (error) {
            console.error(`Error in Author.deleteFromJunction: ${error}`)
            throw error;
        }
    }
}


module.exports=Author;

