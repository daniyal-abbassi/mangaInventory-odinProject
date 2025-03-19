const {Router} = require('express');
const mangaRouter = Router();
const mangaController = require('../controllers/mangaController');
const Manga = require('../models/mangaModel');


mangaRouter.get('/',mangaController.getAllMangas)

mangaRouter.get('/create',mangaController.createMangaGet)
mangaRouter.post('/',mangaController.createManga)


mangaRouter.post('/:id/delete',mangaController.deleteManga)

mangaRouter.get('/:id/show',mangaController.showMangaGet)

mangaRouter.get('/:id/update',mangaController.mangaUpdateGet)
mangaRouter.post('/:id/update',mangaController.mangaUpdataePost)
//others goes here


module.exports=mangaRouter;
