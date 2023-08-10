const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  deleteMultipleUsersByIds,
} = require("../controllers/user");

// Login route
router.get("/login", (req, res) => {
  return res.send("Login Page");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
      })
      .send(token);
  } catch (error) {
    return res.status(400).send({ msg: "Incorrect Email or Password" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").send("Logout Done");
});

router
  .route("/")
  .get(getAllUsers)
  .post(createUser)
  .delete(deleteMultipleUsersByIds);
router
  .route("/:id")
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

module.exports = router;
