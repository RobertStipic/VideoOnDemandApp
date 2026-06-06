import buildAxios from "../api/init-axios.js";

const HomePage = ({ currentUser }) => {
  return <div>Home page</div>;
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
