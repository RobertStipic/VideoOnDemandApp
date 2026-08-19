import "bootstrap/dist/css/bootstrap.min.css";
import buildAxios from "../api/init-axios.js";
import Header from "../components/header.js"
import axios from "axios";
const AppComponent = ({ Component, pageProps }) => {
  return (
  <div>
    <Header currentUser = {pageProps.currentUser}/>
  <Component {...pageProps} />
  </div>
  );
};

AppComponent.getInitialProps = async context => { 

if (typeof window !== "undefined") {
    try {
      const response = await axios.get("/users/currentuser");
      return { pageProps: { currentUser: response.data } };
    } catch (error) {
      return { pageProps: { currentUser: null } };
    }
  }


if (!context.ctx.req || !context.ctx.req.headers.cookie) {
    return {pageProps: {currentUser: null}};
  }
try {
  const client = buildAxios(context.ctx);
  const response = await client.get("/users/currentuser");
  return {pageProps: { currentUser: response.data}};
  }
catch (error){
    return { pageProps: { currentUser: null } };
   } 
};

export default AppComponent;