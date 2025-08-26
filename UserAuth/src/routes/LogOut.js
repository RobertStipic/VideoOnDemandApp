import express from "express";

const LogOutRouter = express.Router();

LogOutRouter.post("/users/logout", (req, res) => {
  try{
  req.session = null;
  res.status(200).send("Logged out");
  }catch (error) {
      res.status(500).send("Unexpected log out error");
    }
});

export { LogOutRouter };
