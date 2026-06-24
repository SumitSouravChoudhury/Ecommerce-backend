const { Router } = require("express");

const {
  handleListAllUsers,
  handleListUserById,
  handleUpdateUserById,
  handleDeleteUserById,
} = require("../controllers/user");

const { accessTo } = require("../middlewares/accessTo");

const router = Router();

router.get("/", accessTo("admin"), handleListAllUsers);

router
  .route("/:userId")
  .get(handleListUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router;
