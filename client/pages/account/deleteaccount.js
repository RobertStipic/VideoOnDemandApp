import Sidebar from "../../components/sidebar.js";
import { useState } from "react";
import Router from "next/router";
import axios from "axios";


const deleteAccount = ({ currentUser }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); 
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");

    const onSubmit = async (event) => {

    if (!window.confirm("Are you sure you want to delete your account?")) {
      return;
    }    
    event.preventDefault();
    setSuccessMessage("");
    try {
      setErrors([]);

      const response = await axios.delete("/users/delete", {
        data: {
        email,
        password,
        confirmPassword,
        }
      });

      if (response.status === 200) {
        setSuccessMessage("Account deleted succesfully. Redicting to homepage");

        setTimeout(() => {
          Router.push("/").then(() => {
                window.location.reload();
            });
        }, 3000);        
      }
    } catch (err) {
      if (err.response.status === 400) {
        setErrors(err.response.data);
      }
      else if (err.response.status === 401) {
        setErrors([{ msg: err.response.data }]);
      }      
      else if (err.response.status === 404) {
        setErrors([{ msg: err.response.data }]);
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
        <h2>Account deletion</h2>
        {currentUser ? (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          className="form-control"
          id="emailInput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <label htmlFor="Password">Password</label>
        <input
          type="password"
          className="form-control"
          id="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          className="form-control"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        ></input>
         <div className="alert alert-danger mt-1 d-inline-block" role="alert">
            Account deletion is <b>permanent</b> and cannot be undone. All data connected to your account will be deleted.
            <br /><b>Including active subscription.</b>
        </div>
      </div>
      {errors.length > 0 && (
        <div className="alert alert-danger" style={{ width: 'fit-content' }}>
          <strong>Something went wrong:</strong>
          <ul className="my-0">
            {errors.map((err) => (
              <li key={err.msg}>{err.msg}</li>
            ))}
          </ul>
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success" style={{ width: 'fit-content' }}>
          <strong>{successMessage}</strong>
        </div>
      )}
      <button type="submit" className="btn btn-danger">
        Delete Account
      </button>
    </form>
        ) : (
        <h3> You are not signed in. Please sign in to continue.</h3>
      )}
      </div>
    </div>
    )};

    export default deleteAccount;