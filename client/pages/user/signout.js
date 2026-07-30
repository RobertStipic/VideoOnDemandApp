import axios from "axios";
import Router from "next/router";
import { useEffect } from "react";
import { useState } from "react";

export default () => {
      const [errors, setErrors] = useState([]);
    
      useEffect(() => {
      const signOut = async () => {
        try {
          setErrors([]);
          const response = await axios.post("/users/logout", {
          });
          if (response.status === 200) {
            Router.push("/").then(() => {
                window.location.reload();
            });
          }
        } catch (err) {
          if (err.response.status === 500) {
            setErrors(err.response.data);
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
  };

};
