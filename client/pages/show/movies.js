import MovieCard from "../../components/movieCard.js";
import buildAxios from "../../api/init-axios.js";
import { useState } from "react";
import axios from "axios";
import { genresArray, languagesArray } from "../../constants/movieFilters.js";

const  MovieList = ({ movies, error }) => {
  const [displayedMovies, setDisplayedMovies] = useState(movies);
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [year, setYear] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [filterErrors, setFilterErrors] = useState([]);
  
  const applyFilters = async () => {
   try {
    setFilterErrors([])
    const params = new URLSearchParams();
    if (genre){
      params.append("genre", genre)
    }
    if (language){
      params.append("language", language)
    }
    if (year){
      params.append("year", year)
    }
    if (startYear){
      params.append("startyear", startYear)
    }    
    if (endYear){
      params.append("endyear", endYear)
    }

    const response = await axios.get(`/movies/filter?${params}`)
    setDisplayedMovies(response.data);
   } catch (error){
     if (error.response.status === 400){
      setFilterErrors(error.response.data);
     }
     else if(error.response.status === 500) {
      setFilterErrors([{msg: error.response.data}]);
     }
     else {
      setFilterErrors([{msg: "Failed to apply filters. Please try again"}]);
     }
   }
  };

  const resetFilters = () => {
     setGenre("");
    setLanguage("");
    setYear("");
    setStartYear("");
    setEndYear("");
    setDisplayedMovies(movies);
    setFilterErrors([]);   
  }


  return (
    <div className="container py-4">
    <h2 className="mb-4">Movies</h2>
     <div className="row g-3 mb-4">
      <div className="col-md-3">
        <label className="form-label">Genre</label> 
        <select className="form-select"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}>
        <option value="">Select Genre</option>          
        {genresArray.map((genre) =>(
          <option key={genre} value={genre}>{genre}</option>
        ))}
        </select>
      </div>
      <div className="col-md-3">
        <label className="form-label">Language</label>
        <select className="form-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}>
        <option value="">Select language</option>  
        {languagesArray.map((language) =>(
          <option key={language} value={language}>{language}</option>
        ))}
        </select>
      </div>
      <div className="col-md-2">
        <label className="form-label">Year</label>
        <input type="number" className="form-control"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="between 1931 - 2021" />
      </div>
      <div className="col-md-2">
        <label className="form-label">Start Year</label>
        <input type="number" className="form-control"
        value={startYear}
        onChange={(e) => setStartYear(e.target.value)}
        placeholder="min: 1931" />
      </div>
      <div className="col-md-2">
        <label className="form-label">End Year</label>
        <input type="number" className="form-control"
        value={endYear}
        onChange={(e) => setEndYear(e.target.value)}
        placeholder="max: 2021" />
      </div>            
     </div>
     <div className="d-flex gap-2 mb-4">
      <button className="btn btn-primary" onClick={applyFilters}>
        Apply filters
      </button>
      <button className="btn btn-outline-secondary" onClick={resetFilters}>
        Reset
      </button>
     </div>
     {filterErrors.length > 0 && (
      <div className="alert alert-danger">
        <strong>Something went wrong</strong>
        <ul className="my-0">
        {filterErrors.map((err) => (
          <li key={err.msg}>{err.msg}</li>
        ))}
        </ul>
      </div>
     )}
    {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
      <div className="row g-4">
        {displayedMovies.map((movie) => (
          <div className="col-12 col-md-6 col-lg-4" key={movie.imdbID}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const client = buildAxios(context);
    const { data } = await client.get("/movies/listmovies");
    return { props: { movies: data } };
  } catch (error) {
    return { props: { error: "Unexpected error" } };
  }
}

export default MovieList;