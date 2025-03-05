import mongoose from "mongoose";

const WatchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  watch_history: [
    {
      movieId: {
        type: String,
        required: true,
      },
      watchedAt: {
        type: Date,
        required: true,
      },
    },
  ],
});
const WatchHistory = mongoose.model("WatchHistory", WatchHistorySchema);

export { WatchHistory };
