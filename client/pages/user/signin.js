import { useState } from "react";
import axios from "axios";
import Router from "next/router";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setErrors([]);
      const response = await axios.post("/users/login", {
        email,
        password,
      });
      if (response.status === 200) {
        Router.push("/");
      }
    } catch (err) {
      if (err.response.status === 400) {
        setErrors(err.response.data);
      } else if (err.response.status === 404) {
        setErrors([{ msg: err.response.data }]);
      } else if (err.response.status === 500) {
        setErrors([{ msg: err.response.data }]);
      }
    }
  };

  return (
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
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-control"
          id="passwordInput"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
      <button type="submit" className="btn btn-primary">
        Sign In
      </button>
    </form>
  );
};