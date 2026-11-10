import { useEffect, useRef } from "react";
import shaka from "shaka-player";
import api from "../api/axios-instance";

const SEND_INTERVAL_MS = 30 * 1000;

const MoviePlayer = ({ movie, initialPosition = 0 }) => {
  const videoRef = useRef(null);
  const lastSentRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const player = new shaka.Player(video);

    player.load(movie.streamUrl).catch((error) => {
      console.error("Error loading video", error);
    });

    const sendProgress = (position, duration) => {
      if (!movie.imdbID || !duration) return;
      api
        .post("/history/progress", {
          movieId: movie.imdbID,
          position: Math.floor(position),
          duration: Math.floor(duration),
        })
        .catch((err) => console.error("Progress send failed", err));
    };

    const onLoadedMetadata = () => {
      if (initialPosition > 0 && initialPosition < video.duration - 5) {
        video.currentTime = initialPosition;
      }
    };

    const onTimeUpdate = () => {
      const now = Date.now();
      if (now - lastSentRef.current >= SEND_INTERVAL_MS) {
        lastSentRef.current = now;
        sendProgress(video.currentTime, video.duration);
      }
    };

    const onPause = () => sendProgress(video.currentTime, video.duration);

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("pause", onPause);

    return () => {
      player.destroy();
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("pause", onPause);
    };
  }, [movie.streamUrl, movie.imdbID, initialPosition]);

  return (
    <div className="container mt-4">
      <h1>{movie.Title}</h1>
      <video ref={videoRef} controls width="100%" />
    </div>
  );
};

export default MoviePlayer;
