import mongoose from "mongoose";
import fs from "fs";
import validator from "validator";

// Creating a schema
const moviesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        unique: true, // Ensures uniqueness
        trim: true
    },
    name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
    trim: true,
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [50, "Name must not exceed 50 characters"],
    validate: {
        validator: validator.isAlphanumeric,
        message: "Name should contain only letters"
    }
}
,
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true // Removed unique constraint for descriptions
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"] // Duration in minutes
    },
    ratings: {
        type: Number,
        default: 0 ,// Default rating if not provided
        min: [1, "Rating must be at least 1"],
        max: [10, "Rating must not exceed 10"]
    },
    totalRating: {
        type: Number,
        default: 0 // Default total ratings count if not provided
    },
    releaseYear: {
        type: Number,
        required: [true, "Release year is required"]
    },
    releaseDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select:false
    },
    genres: {
        type: [String],
        required: [true, "Genres are required"]
    },
    directors: {
        type: [String],
        required: [true, "Directors are required"]
    },
    coverImage: {
        type: String,
        required: [true, "Cover image is required"]
    },
    actors: {
        type: [String],
        required: [true, "Actors are required"]
    },
    createdBy:String,
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
}
);

moviesSchema.virtual('durationInhours').get(function()
    {
   return this.duration/60;
    }
)
moviesSchema.pre('save',function(next){
    this.createdBy="rupak",
    next();
})
moviesSchema.post('save',function(doc,next){
    const content=`a new document is created with the name ${doc.name} and it is created by ${doc.createdBy}\n`;
    fs.writeFileSync('./log/log.txt',content,{flag:'a'},(err)=>{
        console.log(err);
    })
    next();
})
moviesSchema.pre(/^find/,function(next){
    this.find({releaseDate:{$lte:Date.now()}});
    this.startTime =Date.now();
    next();

})
moviesSchema.post(/^find/,function(docs,next){
    this.find({releaseDate:{$lte:Date.now()}});
    this.endTime =Date.now();
    const content=`Quert took time is ${this.endTime-this.startTime}\n`;
    fs.writeFileSync('./log/log.txt',content,{flag:'a'},(err)=>{
        console.log(err);
    })
    
    next();

})
moviesSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match:{releaseDate:{$lte:new Date()}}});
    this.startTime =Date.now();
    next();

})
// Exporting the model
export default mongoose.model("Movie", moviesSchema);
