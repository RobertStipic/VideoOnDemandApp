import buildAxios from "../api/init-axios.js";

const HomePage = ({ currentUser }) => {
  return (
    <div>
      <h1>Home page</h1>
      {currentUser ? (
        <h2>
          You are signed in as: {currentUser.firstName}, {currentUser.email}
        </h2>
      ) : (
        <h2>You are not signed in.</h2>
      )}
    </div>
  );
};


export default HomePage;
