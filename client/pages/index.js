import Link from "next/link";
import { getServerData } from "../api/init-axios";
import { useState } from "react";
import api from "../api/axios-instance";
import ContinueWatchingCard from "../components/continueWatchingCard";
import MovieCard from "../components/movieCard";

const LandingPage = ({
  currentUser,
  continueWatching: initialContinueWatching = [],
  recentlyAdded = [],
}) => {
  const isSubscribed = currentUser?.isSubscribed;
  const [continueWatching, setContinueWatching] = useState(
    initialContinueWatching,
  );
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = async (e, movieId) => {
    e.preventDefault();
    e.stopPropagation();
    setRemovingId(movieId);
    try {
      await api.delete(`/history/continue/${movieId}`);
      setContinueWatching((prev) =>
        prev.filter((item) => item.movieId !== movieId),
      );
    } catch (err) {
      console.error("Remove failed", err);
    } finally {
      setRemovingId(null);
    }
  };

  const logoDivButtons = () => {
    if (!currentUser) {
      return (
        <>
          <Link href="/user/signup" className="btn btn-warning btn-lg me-2">
            Sign Up
          </Link>
          <Link href="/show/movies" className="btn btn-outline-light btn-lg">
            Browse Movies
          </Link>
        </>
      );
    }

    if (isSubscribed) {
      return (
        <>
          <Link href="/show/movies" className="btn btn-success btn-lg me-2">
            Start Watching
          </Link>
          <Link href="/account" className="btn btn-outline-light btn-lg">
            Account
          </Link>
        </>
      );
    }

    return (
      <>
        <Link href="/subscriptions/new" className="btn btn-warning btn-lg me-2">
          Subscribe Now
        </Link>
        <Link href="/show/movies" className="btn btn-outline-light btn-lg">
          Browse Movies
        </Link>
      </>
    );
  };

  return (
    <>
      <div
        className="bg-dark text-white py-2"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7))`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container py-3 text-center">
          <img
            src="/logo-black.png"
            alt="logo"
            style={{ height: "100px", width: "auto" }}
          />
          <p className="lead mb-4">
            Unlimited movies, anytime, anywhere. No ads, no interruptions.
          </p>
          <div className="d-flex justify-content-center flex-wrap gap-2">
            {logoDivButtons()}
          </div>
        </div>
      </div>
      {continueWatching.length > 0 && (
        <div className="container py-4">
          <h2 className="mb-3">Continue Watching</h2>
          <div className="row g-3">
            {continueWatching.map((item) => (
              <ContinueWatchingCard
                key={item.movieId}
                item={item}
                onRemove={handleRemove}
                removing={removingId}
              />
            ))}
          </div>
        </div>
      )}
      {recentlyAdded.length > 0 && (
        <div className="container py-4">
          <h2 className="mb-3">Recently Added</h2>
          <div className="row g-4">
            {recentlyAdded.map((movie) => (
              <div className="col-12 col-md-6 col-lg-4" key={movie.imdbID}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="container py-1">
        <h2 className="text-center mb-3">Why choose VodApp?</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="text-center">
              <i className="display-4 text-warning"></i>
              <h5 className="mt-3">High Quality</h5>
              <p className="text-muted">
                We are streaming best movies in best quality. To your browser.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <i className="display-4 text-warning"></i>
              <h5 className="mt-3">No Ads</h5>
              <p className="text-muted">
                Enjoy your favorite movies without any interruptions or pop-ups.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <i className="display-4 text-warning"></i>
              <h5 className="mt-3">Cancel anytime</h5>
              <p className="text-muted">Cancel your subscription anytime.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-light py-1">
        <div className="container">
          <h2 className="text-center mb-3">Get Started in 3 Steps</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center">
                <div
                  className="display-5 fw-bold text-white bg-success rounded-circle mx-auto d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px" }}
                >
                  1
                </div>
                <h5 className="mt-3">Create Account</h5>
                <p className="text-muted">
                  Sign up in seconds with just your email.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div
                  className="display-5 fw-bold text-white bg-success rounded-circle mx-auto d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px" }}
                >
                  2
                </div>
                <h5 className="mt-3">Choose a Plan</h5>
                <p className="text-muted">
                  Choose one of three avaiable plans.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div
                  className="display-5 fw-bold text-white bg-success rounded-circle mx-auto d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px" }}
                >
                  3
                </div>
                <h5 className="mt-3">Start Watching</h5>
                <p className="text-muted">
                  Enjoy unlimited access to our movie collection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-warning text-dark py-5 text-center">
        <div className="container">
          <h3 className="fw-bold mb-3">Start your movie adventure</h3>
          <p className="lead mb-4">One click away</p>
          {!currentUser ? (
            <Link href="/user/signup" className="btn btn-dark btn-lg">
              Get Started
            </Link>
          ) : !isSubscribed ? (
            <Link href="/subscription" className="btn btn-dark btn-lg">
              Subscribe Now
            </Link>
          ) : (
            <Link href="/show/movies" className="btn btn-dark btn-lg">
              Browse Movies
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const [continueWatching, recentlyAdded] = await Promise.all([
    getServerData(context, "/history/continue").catch(() => []),
    getServerData(context, "/movies/recent").catch(() => []),
  ]);

  return {
    props: {
      continueWatching: continueWatching || [],
      recentlyAdded: recentlyAdded || [],
    },
  };
}
export default LandingPage;
