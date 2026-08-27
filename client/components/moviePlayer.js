import { useEffect, useRef } from "react";
import shaka from "shaka-player";

const MoviePlayer = ({ movie }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const player = new shaka.Player(video);

    player.load(movie.streamUrl).catch((error) => {
      console.error("Error loading video", error);
    });

    return () => {
      player.destroy();
    };
  }, [movie.streamUrl]);

  return (
    <div className="container mt-4">
      <h1>{movie.Title}</h1>
      <video
        ref={videoRef}
        controls
        width="100%"
      />
    </div>
  );
}

export default MoviePlayer;