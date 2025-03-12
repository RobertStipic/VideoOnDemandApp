import mongoose from "mongoose";

const WatchHistorySchema = new mongoose.Schema(
  {
    _id: false,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userEmail: {
      type: String,
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
        _id: false,
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
        ret.userId = ret.userId.toString();
      },
      versionKey: false,
    },
  }
);
const WatchHistory = mongoose.model("WatchHistory", WatchHistorySchema);

export { WatchHistory };
