import "bootstrap/dist/css/bootstrap.min.css";
import buildAxios from "../api/init-axios.js";

const AppComponent = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

AppComponent.getInitialProps = async context => { 

if (!context.ctx.req.headers.cookie) {
    return {pageProps: {currentUser: null}};
  }

  const client = buildAxios(context.ctx);
  const response = await client.get("/users/currentuser");
return {pageProps: { currentUser: response.data}};
};

export default AppComponent;
