import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/users/forgot-password", { email });
      setMessage("If email exists, reset link was sent. Check your inbox.");
    } catch (error) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card bg-secondary-subtle">
            <div className="card-body">
              <h3 className="mb-3">Forgot Password</h3>
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center mt-3">
                  <button type="submit" className="btn btn-primary">
                    Send Reset Link
                  </button>
                </div>
              </form>
              {message && (
                <div className="alert alert-info mt-3">{message}</div>
              )}
              <div className="text-center mt-3">
                <Link href="/user/signin">Back to Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
