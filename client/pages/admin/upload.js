import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import api from "../../api/axios-instance";

const emptyForm = {
  Title: "",
  Year: "",
  Rated: "",
  Released: "",
  Runtime: "",
  Genre: "",
  Director: "",
  Writer: "",
  Actors: "",
  Plot: "",
  Language: "",
  Country: "",
  Awards: "",
  Poster: "",
  Ratings_0_Source: "",
  Ratings_0_Value: "",
  imdbRating: "",
  imdbVotes: "",
  imdbID: "",
  Type: "movie",
  DVD: "",
  BoxOffice: "",
};

export default () => {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState(emptyForm);
  const [omdbJson, setOmdbJson] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");
  const [parsing, setParsing] = useState(false);

  useEffect(() => {
    if (user === null) router.push("/user/signin");
    else if (user && user.role !== "admin") router.push("/");
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  const parseOmdbJson = () => {
    setParsing(true);
    setErrors([]);

    try {
      const data = JSON.parse(omdbJson);
      const rating0 = data.Ratings?.[0];

      setFormData({
        Title: data.Title || "",
        Year: data.Year || "",
        Rated: data.Rated || "",
        Released: data.Released || "",
        Runtime: data.Runtime || "",
        Genre: data.Genre || "",
        Director: data.Director || "",
        Writer: data.Writer || "",
        Actors: data.Actors || "",
        Plot: data.Plot || "",
        Language: data.Language || "",
        Country: data.Country || "",
        Awards: data.Awards || "",
        Poster: data.Poster || "",
        Ratings_0_Source: rating0?.Source || "",
        Ratings_0_Value: rating0?.Value || "",
        imdbRating: data.imdbRating || "",
        imdbVotes: data.imdbVotes || "",
        imdbID: data.imdbID || "",
        Type: data.Type || "movie",
        DVD: data.DVD || "N/A",
        BoxOffice: data.BoxOffice || "N/A",
      });

      setOmdbJson("");
    } catch (err) {
      setErrors([{ msg: "Invalid JSON. Check the format." }]);
    } finally {
      setParsing(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess("");

    if (!videoFile) {
      setErrors([{ msg: "Video file is required" }]);
      return;
    }

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      data.append("video", videoFile);

      const response = await api.post("/movies-admin/upload", data);

      setSuccess(response.data);
      setFormData(emptyForm);
      setVideoFile(null);
      e.target.reset();
    } catch (err) {
      if (err.response?.data) {
        if (Array.isArray(err.response.data)) {
          setErrors(err.response.data);
        } else {
          setErrors([{ msg: err.response.data }]);
        }
      } else {
        setErrors([{ msg: "Upload failed" }]);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Upload Movie</h1>
        <Link href="/admin" className="btn btn-outline-secondary">
          ← Back to Admin Panel
        </Link>
      </div>

      {/* OMDb JSON */}
      <div className="card mb-4">
        <div className="card-header">Paste OMDb JSON</div>
        <div className="card-body">
          <p className="text-muted small mb-2">
            Get JSON from{" "}
            <a
              href="https://www.omdbapi.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              omdbapi.com
            </a>
            . Example:{" "}
            <code>https://www.omdbapi.com/?i=tt7286456&apikey=YOUR_KEY</code>
          </p>
          <textarea
            className="form-control mb-2"
            rows={6}
            value={omdbJson}
            onChange={(e) => setOmdbJson(e.target.value)}
            placeholder='Paste OMDb API JSON here (e.g. {"Title":"Joker",...})'
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={parseOmdbJson}
            disabled={parsing || !omdbJson}
          >
            {parsing ? "Parsing..." : "Parse JSON"}
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card">
        <div className="card-header">Movie Metadata</div>
        <div className="card-body">
          <div className="row g-3">
            {Object.keys(emptyForm).map((field) => (
              <div className="col-md-6" key={field}>
                <label className="form-label">{field}</label>
                {field === "Plot" ? (
                  <textarea
                    className="form-control"
                    rows={3}
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                )}
              </div>
            ))}
            <div className="col-12">
              <label className="form-label">Video file</label>
              <input
                type="file"
                className="form-control"
                accept="video/mp4"
                onChange={(e) => setVideoFile(e.target.files[0])}
              />
            </div>
          </div>

          {errors.length > 0 && (
            <div className="alert alert-danger mt-3">
              <ul className="my-0">
                {errors.map((err, i) => (
                  <li key={i}>{err.msg}</li>
                ))}
              </ul>
            </div>
          )}

          {success && <div className="alert alert-success mt-3">{success}</div>}

          <div className="mt-3">
            <button type="submit" className="btn btn-primary">
              Upload Movie
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary ms-2"
              onClick={() => {
                setFormData(emptyForm);
                setVideoFile(null);
                setErrors([]);
                setSuccess("");
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
