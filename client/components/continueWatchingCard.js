import Link from "next/link";

const ContinueWatchingCard = ({ item, onRemove, removing }) => {
  return (
    <div className="col-6 col-md-4 col-lg-2">
      <Link href={`/watch/${item.movieId}`} className="text-decoration-none">
        <div className="card bg-dark text-white h-100">
          <div className="position-relative">
            <img
              src={item.Poster}
              alt={item.Title}
              className="card-img-top"
              style={{ height: "220px", objectFit: "cover" }}
            />
            <div
              className="position-absolute bottom-0 start-0 end-0"
              style={{
                background: "rgba(0,0,0,0.7)",
                padding: "6px 8px",
              }}
            >
              <div className="progress" style={{ height: "4px" }}>
                <div
                  className="progress-bar bg-danger"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <small className="text-white">{item.percent}%</small>
            </div>
            <button
              type="button"
              onClick={(e) => onRemove(e, item.movieId)}
              disabled={removing === item.movieId}
              className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 fw-bold"
              style={{ zIndex: 10, opacity: 0.8 }}
              title="Remove"
            >
              {removing === item.movieId ? "..." : "×"}
            </button>
          </div>
          <div className="card-body p-2">
            <p className="card-text small mb-0">{item.Title}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ContinueWatchingCard;
