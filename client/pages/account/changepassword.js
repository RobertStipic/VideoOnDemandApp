import Sidebar from "../../components/sidebar.js";
import { useState } from "react";
import axios from "axios";


const ChangePassword = ({ currentUser }) => {
    
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");

    const onSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    try {
      setErrors([]);

      const response = await axios.patch("/users/changepassword", {
        password,
        newPassword,
        confirmNewPassword,
      });

      if (response.status === 200) {
        setSuccessMessage("Password changed succesfully.");
      }
    } catch (err) {
      if (err.response.status === 400) {
        setErrors([{msg: err.response.data}]);
      }
      else if (err.response.status === 500) {
        setErrors([{ msg: err.response.data }]);
      }
    }
  };

    return (
    <div className="d-flex">
        <Sidebar />
        <div className="p-4 flex-grow-1">
        <h2>Change password</h2>
        {currentUser ? (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="currentPassword">Current Password</label>
        <input
          type="password"
          className="form-control"
          id="currentPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>
      <div className="form-group">
        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          className="form-control"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        ></input>
      </div>
      <div className="form-group">
        <label htmlFor="confirmNewPassword">Confirm New Password</label>
        <input
          type="password"
          className="form-control"
          id="confirmNewPassword"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        ></input>
      </div>
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <strong>Something went wrong:</strong>
          <ul className="my-0">
            {errors.map((err) => (
              <li key={err.msg}>{err.msg}</li>
            ))}
          </ul>
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success">
          <strong>{successMessage}</strong>
        </div>
      )}
      <button type="submit" className="btn btn-primary mt-2">
        Change password
      </button>
    </form>
        ) : (
        <h3> You are not signed in. Please sign in to continue.</h3>
      )}
      </div>
    </div>
    )};

    export default ChangePassword;