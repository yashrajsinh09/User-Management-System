const express = require("express");
const {
  CMS_setupSuperAdmin,
  CMS_createUser,
  CMS_login,
  CMS_updateUser,
  CMS_deleteUser,
  CMS_getAllUsers,
  CMS_getUser,
} = require("../controllers/userController");
const { auth, authorizeUser } = require("../middleware/auth");
const router = express.Router();

router.post("/setup-super-admin", CMS_setupSuperAdmin);
router.post("/login", CMS_login);
router.post(
  "/create-user",
  [auth, authorizeUser(["Super Admin", "Admin"])],
  CMS_createUser
);
router.put(
  "/update-user",
  [auth, authorizeUser(["Super Admin", "Admin"])],
  CMS_updateUser
);
router.delete(
  "/delete-user",
  [auth, authorizeUser(["Super Admin", "Admin"])],
  CMS_deleteUser
);
router.get(
  "/get-all-user",
  [auth, authorizeUser(["Super Admin", "Admin"])],
  CMS_getAllUsers
);
router.get(
  "/get-user",
  [auth, authorizeUser(["Super Admin", "Admin", "User"])],
  CMS_getUser
);

module.exports = router;
