import axios from "axios";

const HomePage = ({ currentUser }) => {
  return <div>Home page</div>;
};
HomePage.getInitialProps = async ({ req }) => {
  if (typeof window === "undefined") {
    console.log(req.headers);
    const response = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/users/currentuser",
      {
        headers: {
          Host: req.headers.host,
          cookie: req.headers.cookie,
        },
      },
    );
    return { currentUser: response.data };
  } else {
    const response = await axios.get("/users/currentuser");
    return { currentUser: response.data };
  }
};

export default HomePage;
