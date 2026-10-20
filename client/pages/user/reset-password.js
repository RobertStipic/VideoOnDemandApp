import { useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";
import { useRouter } from "next/router";
import Link from "next/link";

export default () => {
  const router = useRouter();
  const { token } = router.query;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);

    if (newPassword !== confirmPassword) {
      setErrors([{ msg: "Passwords don't match" }]);
      return;
    }

    try {
      await axios.post("/users/reset-password", { token, newPassword });
      setSuccess(true);
      setTimeout(() => Router.push("/user/signin"), 2000);
    } catch (err) {
      if (err.response.status === 422) {
        setErrors(err.response.data);
      } else if (err.response.status === 400) {
        setErrors([{ msg: err.response.data }]);
      } else if (err.response.status === 500) {
        setErrors([{ msg: err.response.data }]);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card bg-secondary-subtle">
            <div className="card-body">
              <h2 className="mb-3">Reset Password</h2>
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
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

                {success && (
                  <div className="alert alert-success mt-3">
                    Password reset successfully. Redirecting to sign in...
                  </div>
                )}

                <div className="text-center mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={success}
                  >
                    Reset Password
                  </button>
                </div>
              </form>
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
