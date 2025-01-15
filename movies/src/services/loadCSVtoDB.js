import { Movie } from "../models/movies.js";
import csvtojson from 'csvtojson';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//const csvFilePath=path.join(__dirname, 'MOVIES_DATA_final.csv');
const csvFilePath=path.join(__dirname, '..', 'csv', 'MOVIES_DATA_final.csv');
const empty = 0;
const MoviesCount= 100;

export async function initizializeCSV(){
    //await Movie.deleteMany({}); //test function
    var count = await Movie.countDocuments();
    if (count === empty){
      console.log('Importing csv data from: ', csvFilePath);
        CSVtoDatabase();
            }
    else if(count===MoviesCount) console.log('Movie collection have all CSV records loaded');
    else console.log("Number of records in Database doesnt match value set by application: ", MoviesCount);
}
function CSVtoDatabase(){ 
    csvtojson()
  .fromFile(csvFilePath, {encoding: 'utf-8'})
  .then(csvData => {
  for (var i=0; i<csvData.length; i++){
    var temp={};
    temp.Title=csvData[i]['Title'];
    temp.Year=csvData[i]['Year'];
    temp.Rated=csvData[i]['Rated'];
    temp.Released=csvData[i]['Released'];
    temp.Runtime=csvData[i]['Runtime'];
    temp.Genre=csvData[i]['Genre'];
    temp.Director=csvData[i]['Genre'];
    temp.Writer=csvData[i]['Writer'];
    temp.Actors=csvData[i]['Actors'];
    temp.Plot=csvData[i]['Plot'];
    temp.Language=csvData[i]['Language'];
    temp.Country=csvData[i]['Country'];
    temp.Awards=csvData[i]['Awards'];
    temp.Poster=csvData[i]['Poster'];
    temp.Ratings_0_Source=csvData[i]['Ratings_0_Source'];
    temp.Ratings_0_Value=csvData[i]['Ratings_0_Value'];
    temp.imdbRating=csvData[i]['imdbRating'];
    temp.imdbVotes=csvData[i]['imdbVotes'];
    temp.imdbID=csvData[i]['imdbID'];
    temp.Type=csvData[i]['Type'];
    temp.DVD=csvData[i]['DVD'];
    temp.BoxOffice=csvData[i]['BoxOffice'];
    temp.Path=csvData[i]['Path'];
    Movie.create(temp);
    console.log("Movie inserted in database: ",i+1,". ", temp.Title);
  }
  })}