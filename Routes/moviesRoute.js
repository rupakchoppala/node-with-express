import express from 'express';
import {getMovies,postMopvies,getMoviesByid,patchMovie,deleteMovie,getHighestMovies,getMovieStats,getMoviesByGenre} from "./../Controllers/moviesControllers.js";
const router=express.Router();
//router.param('id',checkId);
router.route('/highest-rated').get(getHighestMovies,getMovies)
router.route('/movies-stats').get(getMovieStats);
router.route('/movies-by-genre/:genre').get(getMoviesByGenre);

router.route('/').get(getMovies).post(postMopvies);
router.route('/:id')
.get(getMoviesByid)
.patch(patchMovie)
.delete(deleteMovie);
export default router;