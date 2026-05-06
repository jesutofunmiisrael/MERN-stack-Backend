const express = require("express");

const {
  createUser,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  searchUsers,
  exportUsersCSV,
} = require("../Controller/Usercontroller");

const router = express.Router();

router.post("/", createUser);

router.get("/", getUsers);

router.get("/search", searchUsers);

router.get("/export/csv", exportUsersCSV);

router.get("/:id", getSingleUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;