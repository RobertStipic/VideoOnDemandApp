import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [gender, setGender] = useState("Male");
  const [dateOfBirth, setdateOfBirth] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setErrors([]);
      const response = await axios.post(
        "/users/signup",
        {
          email,
          password,
          firstName,
          lastName,
          gender,
          dateOfBirth,
          country,
          city,
        },
        { withCredentials: true },
      );

      if (response.status === 201) {
        setSuccessMessage(
          "Account created! Check your email to activate your account.",
        );
      }
    } catch (err) {
      if (!err.response) {
        setErrors([{ msg: "Network error. Please try again." }]);
        return;
      }
      if (err.response.status === 400) {
        setErrors(err.response.data);
      } else if (err.response.status === 409) {
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
              {successMessage && (
                <div className="alert alert-success">
                  <strong>{successMessage}</strong>
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
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstNameInput"
                    value={firstName}
                    onChange={(e) => setfirstName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastNameInput"
                    value={lastName}
                    onChange={(e) => setlastName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Gender">Gender</label>
                  <select
                    className="form-select"
                    id="GenderSelect"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="dateofbirth">Date Of Birth</label>
                  <input
                    type="text"
                    className="form-control"
                    id="dateofbirth"
                    aria-describedby="date_of_birthHelp"
                    value={dateOfBirth}
                    onChange={(e) => setdateOfBirth(e.target.value)}
                  />
                  <small
                    id="date_of_birthHelp"
                    className="form-text text-muted"
                  >
                    Please enter your date of birth in format "YYYY-MM-DD". You
                    must be at least 18 years old to sign up.
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="country" className="mt-2">
                    Country
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="countryInput"
                    aria-describedby="countryHelp"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                  <small
                    id="countryHelp"
                    className="form-text text-muted text-nowrap"
                  >
                    Please enter your country of residence in ISO 3166-1 alpha-2
                    format.{"  "}
                    <Link href="https://www.iban.com/country-codes">
                      <b>Check here</b>
                    </Link>
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="city" className="mt-2">
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cityInput"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
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
                <div className="text-center mt-2">
                  <button type="submit" className="btn btn-primary">
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
