import axios from "axios";

export default ({ req }) => {
  return axios.create({
    baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
    headers: {
      Host: req.headers.host,
      cookie: req.headers.cookie,
    },
  });
};
