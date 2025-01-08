const express = require("express");
const router = express.Router();

const {
  getProfile,
  followUnFollowUser,
  getSuggestedUser,
  updateUser,
} = require("../controllers/user.controller");
const protectGetMeRoute = require("../middlewares/protectGetMeRoute");

router.get("/profile/:username", protectGetMeRoute, getProfile);

router.post("/follow/:id", protectGetMeRoute, followUnFollowUser);

router.post("/suggested", protectGetMeRoute, getSuggestedUser);

router.post("/update", protectGetMeRoute, updateUser);

module.exports = router;
