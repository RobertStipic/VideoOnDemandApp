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
export const getServerSideProps = async (context) => {
  if (!context.req.headers.cookie) {
    return { props: { currentUser: null } };
  }
  const client = buildAxios(context);
  const response = await client.get("/users/currentuser");
  return { props: { currentUser: response.data } };
};

export default HomePage;
