import Link from "next/link";

export default function Custom404() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{ minHeight: "70vh", padding: "2rem" }}
    >
      <h1
        className="display-1 fw-bold text-danger mb-0"
        style={{ fontSize: "8rem", lineHeight: 1 }}
      >
        404
      </h1>
      <h2 className="mb-3">This page could not be found</h2>
      <p className="text-muted mb-4" style={{ maxWidth: "400px" }}>
        The movie you're looking for might have been removed, or the link is
        incorrect.
      </p>
      <div className="d-flex gap-2">
        <Link href="/" className="btn btn-danger">
          Back to Home
        </Link>
        <Link href="/show/movies" className="btn btn-outline-secondary">
          Browse Movies
        </Link>
      </div>
    </div>
  );
}
