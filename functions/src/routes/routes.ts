import * as express from "express";
const router = express.Router();

router.get("/login", (req, res, next) => {
  console.log("login api endpoint");
  return res.status(200).json("Hello Login Page");
});


export default router;

