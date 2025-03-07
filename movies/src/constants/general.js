export const requestYears = {
  year: "year",
  startyear: "startyear",
  endyear: "endyear",
  minValue: 1931,
  maxValue: 2021,
  sorting: "sorting",
  sort: {
    ascending: "ascending",
    descending: "descending",
    values: ["ascending", "descending"],
  },
};
export const requestLanguages = {
  language: "language",
  // prettier-ignore
  languagesArray: [
  "English", "Italian", "Mandarin", "Latin", "Spanish", "Sicilian", "Hebrew",
  "Polish", "German", "Quenya", "Sindarin", "French", "Japanese", "Czech",
  "Portuguese", "Swahili", "Xhosa", "Zhulu", "Hungarian", "Cantonese",
  "Vietnamese", "Arabic", "Nepali", "Hindi", "Esperanto", "Russian",
  "Korean", "Gaelic", "Yiddish", "Turkish", "Amharic", "Danish",
  ],
  languagesMessage: `List of valid languages: English, Italian, Mandarin, Latin, Spanish, German, French, Japanese, Russian, Sicilian, 
Hebrew, Polish, Quenya, Czech, Portuguese, Swahili, Xhosa, Zhulu, Hungarian, Cantonese, Vietnamese, Arabic, Nepali, Hindi,
Esperanto, Korean, Gaelic, Yiddish, Turkish, Amharic, Danish`,
};

export const requestGenres = {
  genre: "genre",
  // prettier-ignore
  genresArray: [
    "Drama", "Crime", "Action", "History", "Biography", "Action", "Adventure", "Western", "Romance", "Sci-Fi", "Mystery",
    "Fantasy", "Thriller", "Comedy", "Horror", "Animation", "Music", "War", "Family", "Film-Noir"
  ],
  genresMessage: `List of valid movie genres: Drama, Crime, Action, History, Biography, Action, Adventure, Western, Romance, Sci-Fi, Mystery,
    Fantasy, Thriller, Comedy, "Horror", Animation, Music, War, Family, Film-Noir`,
};

export const constants = {
  // prettier-ignore
  columns : [
  "Title", "Year", "Rated", "Released", "Runtime", "Genre", "Director", "Writer", "Actors", "Plot",
  "Language", "Country", "Awards", "Poster", "Ratings_0_Source", "Ratings_0_Value", "imdbRating", "imdbVotes", "imdbID",
  "Type", "DVD", "BoxOffice", "Path"
],
  empty: 0,
  MoviesCount: 100,
  TEMP_PAGESIZE: 10,
  TEMP_N: 0,
};
