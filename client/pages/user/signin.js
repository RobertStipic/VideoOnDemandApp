import { useState } from "react";
import axios from "axios";
import Router, { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

export default () => {
  const router = useRouter();
  const { activated, error } = router.query;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { login } = useAuth();

  // Modal state
  const [showResendModal, setShowResendModal] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setErrors([]);
      const response = await axios.post(
        "/users/login",
        { email, password },
        { withCredentials: true },
      );

      if (response.status === 200) {
        const { existingEmail, accessToken } = response.data;
        login(existingEmail, accessToken);
        Router.push("/");
      }
    } catch (err) {
      if (!err.response) {
        setErrors([{ msg: "Network error. Please try again." }]);
        return;
      }

      if (err.response.status === 400) {
        setErrors(err.response.data);
      } else if (err.response.status === 403) {
        setErrors([{ msg: err.response.data }]);
      } else if (err.response.status === 404) {
        setErrors([{ msg: err.response.data }]);
      } else if (err.response.status === 500) {
        setErrors([{ msg: err.response.data }]);
      }
    }
  };

  const showResend =
    error === "invalid-token" ||
    errors.some((e) => e.msg?.toLowerCase().includes("not activated"));

  const openResendModal = () => {
    setResendEmail(email);
    setResendMessage("");
    setResendError("");
    setShowResendModal(true);
  };

  const closeResendModal = () => {
    setShowResendModal(false);
    setResendMessage("");
    setResendError("");
  };

  const handleResend = async () => {
    if (!resendEmail) {
      setResendError("Please enter your email.");
      return;
    }

    setResendLoading(true);
    setResendMessage("");
    setResendError("");

    try {
      const response = await axios.post("/users/resend-activation", {
        email: resendEmail,
      });
      setResendMessage(response.data);
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 429) {
        setResendError(err.response.data);
      } else {
        setResendError("Failed to resend. Try again.");
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card bg-secondary-subtle">
            <div className="card-body">
              {activated && (
                <div className="alert alert-success">
                  Account activated! You can now sign in.
                </div>
              )}
              {error === "no-token" && (
                <div className="alert alert-danger">
                  Missing activation token.
                </div>
              )}
              {error === "server-error" && (
                <div className="alert alert-danger">
                  Server error. Please try again.
                </div>
              )}

              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {errors.length > 0 && (
                  <div className="alert alert-danger">
                    <strong>Something went wrong:</strong>
                    <ul className="my-0">
                      {errors.map((err, i) => (
                        <li key={i}>
                          {typeof err.msg === "string"
                            ? err.msg
                            : JSON.stringify(err.msg)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {showResend && (
                  <div className="alert alert-warning">
                    <p className="mb-2">
                      {error === "invalid-token"
                        ? "Invalid or expired activation link."
                        : "Account not activated. Check your email."}
                    </p>
                    <button
                      type="button"
                      className="btn btn-sm btn-warning"
                      onClick={openResendModal}
                    >
                      Resend activation email
                    </button>
                  </div>
                )}

                <div className="text-center mt-2">
                  <button type="submit" className="btn btn-primary">
                    Sign In
                  </button>
                  <div className="text-center mt-2">
                    <Link href="/user/forgot-password">Forgot password?</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showResendModal && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={closeResendModal}
          ></div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeResendModal();
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Resend Activation Email</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeResendModal}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="resendEmail">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="resendEmail"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      autoFocus
                    />
                  </div>

                  {resendMessage && (
                    <div className="alert alert-success mt-3 mb-0">
                      {resendMessage}
                    </div>
                  )}

                  {resendError && (
                    <div className="alert alert-danger mt-3 mb-0">
                      {resendError}
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeResendModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={handleResend}
                    disabled={resendLoading}
                  >
                    {resendLoading ? "Sending..." : "Resend"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
