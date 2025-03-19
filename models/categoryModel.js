const pool = require('../database/pool');


const Category = {
    getAll: async () => {
        try {
            const result = await pool.query('SELECT * FROM category');
            return result.rows;
        } catch (error) {
            console.error(`Error in category.getAll: ${error}`);
            throw error;
        }
    },
    getCategoriesWithoutManga: async() => {
        try {
            const result = await pool.query(' SELECT category.* FROM category LEFT JOIN manga_categories USING(category_id) WHERE manga_categories.category_id IS NULL');
            return result.rows;
        } catch (error) {
            console.error(`ERROR IN Category.getCategoriesWithoutMangas: ${error}`)
            throw error;
        }
    },
    getCategoriesWithManga: async() => {
        try {
            const result = await pool.query('SELECT DISTINCT category.* FROM category RIGHT JOIN manga_categories USING(category_id)  WHERE manga_categories.category_id IS NOT NULL');
            return result.rows;      
        } catch (error) {
            console.error(`ERROR IN Category.getCategoriesWithManga: ${error}`)
            throw error;
        }
    },
    create: async(name) => {
        try {
            const result = await pool.query('INSERT INTO category(name) VALUES($1) RETURNING *',[name]);
            return result.rows[0];
        } catch (error) {
            console.error(`Error in category.create: ${error}`)
            throw error;
        }
    },
    addToJunctionTable: async(manga_id,category_id)=> {
        try {
            
                await pool.query('INSERT INTO manga_categories(manga_id,category_id) VALUES($1,$2)',[manga_id,category_id])
        } catch (error) {
            console.error(`error in adding to juctionTable manga_categories: ${error}`)
            throw error;
        }
    },
    getId: async(name) => {
        try {
            const  result = await pool.query('SELECT category_id FROM category WHERE name=$1',[name]);
            
            return result.rows[0]
        } catch (error) {
            console.error(`error while getting category.getID: ${error}`);
            throw error;
        }
    },
    getCategoryByName: async(name) => {
        try{
        const  result = await pool.query('SELECT name FROM category WHERE name=$1',[name]);
            
        return result.rows[0]
    } catch (error) {
        console.error(`error while getting category.getID: ${error}`);
        throw error;
    }
},
    
    getCategoryById: async(category_id) => {
        try {
            const result = await pool.query('SELECT name FROM category WHERE category_id=$1',[category_id]);
            return result.rows[0];
        } catch (error) {
            console.error(`error while getting Category.getCategoryById: ${error}`);
        throw error
        }
    },
    getCategoriesNamesById: async(categoriesIdsArray) => {
        try {
            const result = await pool.query('SELECT * FROM category WHERE category_id=ANY($1)',[categoriesIdsArray]);
            return result.rows;
        } catch (error) {
            console.error(`ERROR IN Category.getCategoriesNamesById: ${error}`);
            throw error;
        }
    },
    getMangas: async(category_id) => {
        try {
            const result = await pool.query('SELECT * FROM manga_categories INNER JOIN manga USING(manga_id) INNER JOIN category USING(category_id) WHERE category_id=$1',[category_id])
            return result.rows;
        } catch (error) {
            console.error(`Error in Category.getMangas: ${error}`)
            throw error;
        }
    },
    getMangasByCategoriesArray: async(categories)=>{
        try {
            const result = await pool.query('SELECT DISTINCT manga.* FROM manga INNER JOIN manga_categories USING (manga_id) WHERE manga_categories.category_id=ANY($1)',[categories]);
            return result.rows;
        } catch (error) {
            console.error(`Error in Category.getMangasByCategoriesArray: ${error}`)
            throw error;
        }
    },
    //delete from junction table with manga_id,category_id
    deleteFromJunction: async(manga_id,category_id)=>{
        try {
             await pool.query('DELETE FROM manga_categories WHERE manga_id=$1 AND category_id=$2',[manga_id,category_id]);
        } catch (error) {
            console.error(`Error in Category.deleteFromJunction: ${error}`)
            throw error;
        }
    },
    deleteFromCategories: async(category_id)=>{
        try {
             await pool.query('DELETE FROM category WHERE category_id=$1',[category_id])
        } catch (error) {
            console.error(`Error in Category.deleteFromCategories: ${error}`)
            throw error;
        }
    },

}   

module.exports=Category;