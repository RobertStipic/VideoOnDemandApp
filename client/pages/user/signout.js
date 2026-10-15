import axios from "axios";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default () => {
  const [errors, setErrors] = useState([]);
  const { logout } = useAuth();

  useEffect(() => {
    const signOut = async () => {
      try {
        setErrors([]);
        const response = await axios.post(
          "/users/logout",
          {},
          { withCredentials: true },
        );

        if (response.status === 200) {
          logout();
          Router.push("/");
        }
      } catch (err) {
        if (err.response?.status === 500) {
          setErrors([{ msg: err.response.data }]);
        }
      }
    };

    signOut();
  }, []);

  if (errors.length > 0) {
    return (
      <div className="alert alert-danger">
        <strong>Something went wrong:</strong>
        <ul className="my-0">
          {errors.map((err) => (
            <li key={err.msg}>{err.msg}</li>
          ))}
        </ul>
      </div>
    );
  }

  return <div>Signing out...</div>;
};
