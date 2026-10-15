import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Header from "../components/header.js";
import { getServerUser } from "../api/init-axios.js";

const AppComponent = ({ Component, pageProps }) => {
  return (
    <AuthProvider
      initialUser={pageProps.currentUser}
      initialAccessToken={pageProps.initialAccessToken}
    >
      <div>
        <Header />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  if (typeof window === "undefined") {
    // Server-side
    const result = await getServerUser(appContext.ctx.req);
    if (result) {
      return {
        pageProps: {
          currentUser: result.user,
          initialAccessToken: result.accessToken,
        },
      };
    }
    return { pageProps: { currentUser: null, initialAccessToken: null } };
  }

  // Client-side
  try {
    const { default: axios } = await import("axios");
    const res = await axios.post(
      "/users/refresh",
      {},
      { withCredentials: true },
    );
    const { accessToken } = res.data;

    const userRes = await axios.get("/users/currentuser", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      pageProps: {
        currentUser: userRes.data,
        initialAccessToken: accessToken,
      },
    };
  } catch (error) {
    return { pageProps: { currentUser: null, initialAccessToken: null } };
  }
};

export default AppComponent;
