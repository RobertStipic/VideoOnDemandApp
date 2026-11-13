import mongoose from "mongoose";

const WatchLaterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    movieId: {
      type: String,
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
      versionKey: false,
    },
  },
);

WatchLaterSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const WatchLater = mongoose.model("WatchLater", WatchLaterSchema);

export { WatchLater };
