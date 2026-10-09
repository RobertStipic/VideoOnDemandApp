import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGOATLAS_URL);

export { client };
