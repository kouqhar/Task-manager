const router = require("express").Router();
const multer = require("multer");

// Load middleware
const auth = require("../middleware/auth");

// Load register controller
const {
  getUsers,
  getTasks,
  getTaskById,
  createUser,
  createTask,
  updateUser,
  getProfilePicture,
  uploadProfilePicture,
  updateTask,
  deleteUser,
  deleteTask,
  myProfile,
  logoutUser,
  logoutAllUsers,
  deleteProfilePicture,
} = require("../controllers/register");

// Initialize multer
const uploadAvatar = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    const { originalname } = file;
    const regExp = /\.(jpg|jpeg|png)$/gi;
    const expression = regExp.test(originalname);
    if (!expression)
      return cb(new Error("Please upload a valid image file"), false);

    cb(undefined, true);
  },
});
const profilePicture = uploadAvatar.single("avatar");

// Get all users
router.get("/", auth, getUsers);

// Get all users
router.get("/me", auth, myProfile);

// Create a new user
router.post("/", createUser);

// Update a new user
router.patch("/me", auth, updateUser);

// Get profile Picture
router.get("/:id/avatar", getProfilePicture);

// Upload profile Picture
router.post("/me/avatar", auth, profilePicture, uploadProfilePicture);

// Delete profile Picture
router.delete("/me/avatar", auth, deleteProfilePicture);

// Delete a user
router.delete("/me", auth, deleteUser);

// Logout a user
router.post("/logout", auth, logoutUser);

// Logout All users
router.post("/logoutAll", auth, logoutAllUsers);

// Get all tasks
router.get("/task", auth, getTasks);

// Get task by ID
router.get("/task/:id", auth, getTaskById);

// Create a new task
router.post("/task", auth, createTask);

// Update a new task
router.patch("/task/:id", auth, updateTask);

// Delete a task
router.delete("/task/:id", auth, deleteTask);

module.exports = router;
