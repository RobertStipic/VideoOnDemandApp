import mongoose from "mongoose";

const MoviesSchema = new mongoose.Schema({
    Title:{
        type: String,
        required: true
    },
    Year:{
        type: Number,
        required: true
    },
    Rated:{
        type: String,
        required: true
    },
    Released:{
        type: String,
        required: true
    },
    Runtime:{
        type: String,
        required: true
    },
    Genre:{
        type: String,
        required: true
    },
    Director:{
        type: String,
        required: true
    },
    Writer:{
        type: String,
        required: true
    },
    Actors:{
        type: String,
        required: true
    },
    Plot:{
        type: String,
        required: true
    },
    Language:{
        type: String,
        required: true
    },
    Country:{
        type: String,
        required: true
    },
    Awards:{
        type: String,
        required: true
    },
    Poster:{
        type: String,
        required: true
    },
    Awards:{
        type: String,
        required: true
    },
    Ratings_0_Source:{
        type: String,
        required: true
    },
    Ratings_0_Value:{
        type: String,
        required: true
    },
    imdbRating:{
        type: String,
        required: true
    },
    imdbVotes:{
        type: String,
        required: true
    },
    imdbID:{
        type: String,
        required: true
    },
    Type:{
        type: String,
        required: true
    },
    DVD:{
        type: String,
        required: true
    },
    BoxOffice:{
        type: String,
        required: true
    },
    Path: {
        type: String,
        required: true
    }
});

const Movie = mongoose.model('Movies', MoviesSchema)

export { Movie };