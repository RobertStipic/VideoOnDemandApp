import { Movie } from "../models/movies.js";
import {csvtojson} from 'csvtojson';


const MoviesCount= 100;

export async function initizializeCSV(){
    var count = await Movie.countDocuments();
    if (count === empty){
        CSVtoDatabase();
            }
    else if(count===MoviesCount) console.log('Collection have all records, CSV already loaded');
    else console.log("Number of records in Database doesnt match application set value ", MoviesCount);
}

function CSVtoDatabase(){ 
  //to be implemented
};