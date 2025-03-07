import OpenAI from "openai/index.mjs";
import { constants } from "../constants/general.js";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// Function to get the embeddings using the OpenAI API
export async function getEmbedding(text) {
  const results = await openai.embeddings.create({
    model: constants.embeddings.model,
    input: text,
    encoding_format: constants.embeddings.encoding,
  });
  return results.data[0].embedding;
}
