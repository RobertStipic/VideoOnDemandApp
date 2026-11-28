import axios from "axios";

const BASE_URL =
  typeof window === "undefined"
    ? "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local"
    : "/";

export const createClient = ({ accessToken, host, cookie } = {}) => {
  const headers = {};

  if (host) headers.Host = host;
  if (cookie) headers.cookie = cookie;
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  return axios.create({
    baseURL: BASE_URL,
    headers,
    withCredentials: true,
  });
};

// 👇 NOVO: Helper za parsiranje cookieja
const parseCookies = (cookieHeader) => {
  return cookieHeader.split(";").reduce((acc, c) => {
    const [key, ...val] = c.trim().split("=");
    acc[key] = val.join("=");
    return acc;
  }, {});
};

export const getServerUser = async (req) => {
  if (!req || !req.headers.cookie) return null;

  const baseHeaders = {
    Host: req.headers.host,
    cookie: req.headers.cookie,
  };

  const cookies = parseCookies(req.headers.cookie);
  let accessToken;

  if (cookies.impersonationToken) {
    accessToken = decodeURIComponent(cookies.impersonationToken);
  } else {
    try {
      const refreshRes = await axios.post(
        `${BASE_URL}/users/refresh`,
        {},
        { headers: baseHeaders },
      );
      accessToken = refreshRes.data.accessToken;
    } catch (error) {
      return null;
    }
  }

  try {
    const userRes = await axios.get(`${BASE_URL}/users/currentuser`, {
      headers: { ...baseHeaders, Authorization: `Bearer ${accessToken}` },
    });
    return { user: userRes.data, accessToken };
  } catch (error) {
    return null;
  }
};

export const getServerData = async (context, url, config = {}) => {
  const req = context.req;
  if (!req || !req.headers.cookie) return null;

  const baseHeaders = {
    Host: req.headers.host,
    cookie: req.headers.cookie,
  };

  const cookies = parseCookies(req.headers.cookie);
  let accessToken;

  if (cookies.impersonationToken) {
    accessToken = decodeURIComponent(cookies.impersonationToken);
  } else {
    try {
      const refreshRes = await axios.post(
        `${BASE_URL}/users/refresh`,
        {},
        { headers: baseHeaders },
      );
      accessToken = refreshRes.data.accessToken;
    } catch (error) {
      return null;
    }
  }

  try {
    const client = createClient({
      host: req.headers.host,
      cookie: req.headers.cookie,
      accessToken,
    });

    const { data } = await client.request({
      url,
      method: config.method || "get",
      data: config.data,
    });
    return data;
  } catch (error) {
    return null;
  }
};
