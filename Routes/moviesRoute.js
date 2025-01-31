import express from 'express';
import {getMovies,postMopvies,getMoviesByid,patchMovie,deleteMovie,getHighestMovies,getMovieStats,getMoviesByGenre} from "./../Controllers/moviesControllers.js";
import { protect ,restrict} from '../Controllers/authController.js';
const router=express.Router();
//router.param('id',checkId);
router.route('/highest-rated').get(getHighestMovies,getMovies)
router.route('/movies-stats').get(getMovieStats);
router.route('/movies-by-genre/:genre').get(getMoviesByGenre);

router.route('/').get(protect,getMovies).post(postMopvies);
router.route('/:id')
.get(getMoviesByid)
.patch(patchMovie)
.delete(protect,restrict('admin'),deleteMovie);
export default router;