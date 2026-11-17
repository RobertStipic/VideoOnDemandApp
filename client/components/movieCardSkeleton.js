const MovieCardSkeleton = () => {
  return (
    <div className="card bg-dark h-100" style={{ borderRadius: "8px" }}>
      <div
        className="placeholder-glow"
        style={{ height: "380px", backgroundColor: "#2c2c2c" }}
      />
      <div className="card-body">
        <h5 className="placeholder-glow">
          <span className="placeholder col-8 bg-secondary" />
        </h5>
        <p className="placeholder-glow mb-2">
          <span className="placeholder col-4 bg-secondary" />
          <span className="placeholder col-3 bg-secondary ms-1" />
        </p>
        <p className="placeholder-glow">
          <span className="placeholder col-12 bg-secondary" />
          <span className="placeholder col-10 bg-secondary" />
          <span className="placeholder col-6 bg-secondary" />
        </p>
        <div className="d-flex justify-content-between mt-3">
          <span className="placeholder col-3 bg-secondary" />
          <span className="placeholder col-2 bg-secondary" />
        </div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
