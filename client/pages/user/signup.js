import Link from "next/link";
export default () => {
  return (
    <form>
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input type="email" className="form-control" id="emailInput"></input>
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-control"
          id="passwordInput"
        ></input>
      </div>
      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input type="text" className="form-control" id="firstNameInput"></input>
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Last Name</label>
        <input type="text" className="form-control" id="lastNameInput"></input>
      </div>
      <div className="form-group">
        <label htmlFor="Gender">Gender</label>
        <select className="form-control" id="GenderSelect">
          <option>Male</option>
          <option>Female</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="dateofbirth">Date Of Birth</label>
        <input
          type="text"
          className="form-control"
          id="dateofbirth"
          aria-describedby="date_of_birthHelp"
        ></input>
        <small id="date_of_birthHelp" className="form-text text-muted">
          Please enter your date of birth in format "YYYY-MM-DD". You must be at
          least 18 years old to sign up.
        </small>
      </div>
      <div className="form-group">
        <label htmlFor="country">Country</label>
        <input
          type="text"
          className="form-control"
          id="countryInput"
          aria-describedby="countryHelp"
        ></input>
        <small id="countryHelp" className="form-text text-muted">
          Please enter your country of residence in ISO 3166-1 alpha-2 format.
          {"  "}
          <Link href="https://www.iban.com/country-codes">
            <b>Check here</b>
          </Link>
        </small>
      </div>
      <div className="form-group">
        <label htmlFor="city">City</label>
        <input type="text" className="form-control" id="cityInput"></input>
      </div>
      <button type="submit" className="btn btn-primary">
        Sign Up
      </button>
    </form>
  );
};
