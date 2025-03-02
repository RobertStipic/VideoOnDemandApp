import express from "express";

const LogOutRouter = express.Router();

LogOutRouter.post("/users/logout", (req, res) => {
  req.session = null;
  res.status(200).send("Logged out");
});

export { LogOutRouter };
