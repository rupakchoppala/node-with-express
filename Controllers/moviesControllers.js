//import fs from 'fs';
import { match } from 'assert';
import Movie from '../Models/movieModel.js';
import movieModel from '../Models/movieModel.js';
import { count, error } from 'console';
import { ApiFeatures } from '../utils/Apifeatures.js';
import asyncErrorHandler from '../utils/ayncErrohandleer.js';
import CustomError from '../utils/custom error.js';



//validate movie
// export const validateMovie=(req,res,next)=>{
//     const {title,year}=req.body;
//     if(!movie || !release){
//         return res.status(400).json({
//             status:"Fail",
//             message:"Movie and release date are required"
//             });
//             }
//             next();
//             }

//Route=http+url

export const getHighestMovies=(req,res,next)=>{
    req.query.limit='5';
    req.query.sort='-ratings'
    next();
}
export  const getMovies=asyncErrorHandler(async(req,res,next)=>{

      const features=new ApiFeatures(Movie.find(),req.query).sort().filter().limitFields().paginate();
      let movies=await features.query;
     //console.log(rupak)
      //console.log(req.query);
        // let queryObj={...req.query};
        // const excludedFields=['page','sort','limit','fields'];
        //  excludedFields.forEach((el)=>delete queryObj[el]);
    //   const movies=await Movie.find(queryObj);//not working if there is sorting and pagination
     // const movies=await Movie.find({duartion:+req.query.duration,ratings:+req.query.bodyratings});
     //const movies=await Movie.find().where('duration').equals(req.query.duration)
     // .where('ratings').equals(req.query.ratings);//if we donty specify query string then there is erro
     //using mongoose special operatoors ot methods
    //  const movies=await Movie.find().where('duration').gte(req.query.duration)
    //   .where('ratings').gte(req.query.ratings);
    //console.log(req.query.sort);
    // if (req.query.sort) {
    //     const sortFields = req.query.sort.split(',').join(' '); // Split by commas to handle multiple fields
    //     queri = queri.sort(sortFields); // Apply sorting based on the query params
    // } else {
    //     // Default sorting by createdAt in descending order
    //     queri = queri.sort('-createdAt');
        
    // }
    // if(req.query.fields){
    //     const fields= req.query.fields.split(',').join(' ');
    //     console.log(fields);
    //     queri=queri.select(fields);
    // }
    // else{
    //     queri=queri.select('-__v');
    // }
    // const page=req.query.page*1||1;
    // const limit=req.query.limit*1||10;
    // const skip=(page-1)*limit;
    // queri=queri.skip(skip).limit(limit);
    // if(req.query.page){
    //     const movieCount=await movieModel.countDocuments();

    //     if(skip >=movieCount){
    //         throw new error("this page is not found");
    //     }
    // }
    
     
     return res.status(200).json({
        status:"Success",
        length:movies.length,
        data:{
            movies
        }
    })
}
    )

    // export const getAllMovies = async (req, res) => {
    //     try {
    //       const movies = await Movie.find(); // Fetch all movies without any filters
    //       res.status(200).json({
    //         status: "Success",
    //         length: movies.length,
    //         data: { movies },
    //       });
    //     } catch (error) {
    //       res.status(400).json({
    //         status: "Fail",
    //         message: error.message,
    //       });
    //     }
    //   };
      
export  const  getMoviesByid=asyncErrorHandler(async(req,res,next)=>{
    const id=req.params.id;
   // const movie=await Movie.find({_id:id});

    const movie=await Movie.findById(id);
    if(!movie){
        const err=new CustomError("Movie with this id is not found",404);
        return next(err);
    }
    return res.status(200).json({
        status:"Success",
        data:{
            movie
    } })
   
   
}
)
//get movie by id
//app.get('/api/v1/movies/:id',
 //});
 //HAndling patch method
 export  const patchMovie=asyncErrorHandler(async (req,res,next)=>{
    
         const updatedMovie=await  Movie.findByIdAndUpdate(req.params.id,req.body,
            {new:true,runValidators:true});
            if(!updatedMovie){
                const err=new CustomError("Movie with this id is not found",404);
                return next(err);
            }
            return res.status(200).json({
                status:"Success",
                data:{
                    movie:updatedMovie
                    }
                    })                  
         
    
    

    })
    
//Handling post method
export  const postMopvies=asyncErrorHandler(async (req,res,next)=>{
        const movie=await Movie.create(req.body);
       return  res.status(201).json({
            status:"success",
            data:{
                movie:movie
            }
        })});
        // catch(error){
        //     //console.log(error);
        // return    res.status(400).json({
        //         status:"fail",
        //         message:error.message
        // })}
//Handling delete method
export  const deleteMovie=asyncErrorHandler(async(req,res,next)=>{

       const deletemopvie= await Movie.findByIdAndDelete(req.params.id);
       if(!deletemopvie){
        const err=new CustomError("Movie with this id is not found",404);
        return next(err);
    }
       return res.status(204).json({
        status:"Success",
        data:{
            message:"Movie deleted successfully"
            }
            })

    }
             )             

export const  getMovieStats=asyncErrorHandler(async(req,res,next)=>{
    
        const stats=await Movie.aggregate([
            {$match:{ratings:{$gte:8}}},
            {$group:{_id:'$releaseYear'
                ,avgRating:{$avg:'$ratings'},
            avgDuratin:{$avg:'$duration'},
            minRating:{$min:'$ratings'},
            maxRating:{$max:'$ratings'},
            totalRating:{$sum:'$ratings'},
            movieCount:{$sum:1}

            }},
            {$sort:{avgRating:-1}},
            {$match:{avgRating:{$gte:8.6}}}
        ]);
       return res.status(201).json({
            status:"success",
            data:{
                stats
            }});


    
})
export const getMoviesByGenre=asyncErrorHandler(async(req,res,next)=>{

       const genre=req.params.genre;
       const movies=await Movie.aggregate([
        {$unwind:'$genres'},
        {$group:{_id:'$genres',
            count:{$sum:1},
            movies:{$push:'$title'}, 
            
        }},
        {$addFields:{genre:'$_id'}},
        {$project:{_id:0}},
        {$sort:{count:-1}},
        {$match:{genre:genre}}
      //  {$limit:6}


       ])
       return res.status(201).json({
        status:"success",
        count:movies.length,
        data:{
            movies
            }
            });

    
   
});