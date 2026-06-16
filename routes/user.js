const { Router } = require("express");

const {
  handleListAllUsers,
  handleListUserById,
  handleUpdateUserById,
  handleDeleteUserById,
} = require("../controllers/user");

const router = Router();

router.get("/", handleListAllUsers);

router
  .route("/:userId")
  .get(handleListUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router;
