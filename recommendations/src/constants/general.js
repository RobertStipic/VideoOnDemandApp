import e from "express";

export const constants = {
  vector: {
    numDimensions: 1536,
    name: "vector_index",
    type: "vectorSearch",
    filedType: "vector",
    path: "embedding",
    similarity: "cosine",
    meta: "vectorSearchScore",
  },
  embeddings: {
    model: "text-embedding-3-small",
    encoding: "float",
  },
  numbers: {
    empty: 0,
    MoviesCount: 100,
  },
  encoding: "utf-8",
};
