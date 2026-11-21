import { useState } from "react";
import api from "../api/axios-instance";
import { formatDate } from "../common/formatDate";

const MovieReview = ({ movieId, initialReviews, initialAverage }) => {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [average, setAverage] = useState(initialAverage || 0);

  const [myRating, setMyRating] = useState(0);
  const [myText, setMyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (myRating === 0) {
      setError("Please select a rating.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await api.post(`/reviews/${movieId}`, {
        rating: myRating,
        text: myText,
      });

      const res = await api.get(`/reviews/${movieId}`);
      setReviews(res.data.reviews);
      setAverage(res.data.averageRating);

      setMyRating(0);
      setMyText("");
    } catch (err) {
      setError(err.response?.data || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h3 className="mb-4">Reviews & Ratings</h3>

      {/* Average rating */}
      <div className="d-flex align-items-center mb-4">
        <h1 className="display-4 mb-0 me-3 text-warning">{average}</h1>
        <div>
          <div className="text-warning fs-4">
            {"★".repeat(Math.round(average))}
            {"☆".repeat(5 - Math.round(average))}
          </div>
          <p className="text-muted mb-0">Based on {reviews.length} reviews</p>
        </div>
      </div>

      <div className="row">
        {/* List */}
        <div className="col-md-7">
          <h5 className="mb-3">What others say</h5>
          {reviews.length === 0 ? (
            <p className="text-muted">No reviews yet. Be the first!</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="card bg-dark text-white border-secondary"
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <strong>{rev.userEmail}</strong>
                      <span className="text-warning">
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)}
                      </span>
                    </div>
                    <p className="mb-1">{rev.text}</p>
                    <small className="text-muted">
                      {formatDate(rev.createdAt)}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form*/}
        <div className="col-md-5">
          <div className="card bg-secondary-subtle text-dark">
            <div className="card-body">
              <h5 className="card-title">Leave a Review</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Your Rating</label>
                  <div
                    className="fs-3 text-warning"
                    style={{ cursor: "pointer" }}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setMyRating(star)}
                        style={{
                          color: star <= myRating ? "#ffc107" : "#6c757d",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Your Review (optional)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={myText}
                    onChange={(e) => setMyText(e.target.value)}
                    placeholder="What did you think?"
                    maxLength={1000}
                  ></textarea>
                </div>
                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}
                <button
                  type="submit"
                  className="btn btn-warning w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieReview;
