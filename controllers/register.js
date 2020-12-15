const sharp = require("sharp");
const { User } = require("../models/User");
const { Task } = require("../models/Task");
const {
  sendWelcomeEmail,
  sendCancellationEmail,
} = require("../emails/account");

// User
const createUser = async (req, res) => {
  const isUser = await User.findOne({ email: req.body.email });
  if (isUser)
    return res.status(400).send("The user with that email already exist!!!");

  try {
    const newUser = new User(req.body);
    if (!newUser)
      return res.status(400).send("There was an error creating account.");

    await newUser.save();
    sendWelcomeEmail(newUser);
    const token = await newUser.generateAuthToken();

    res.status(201).send({ newUser, token });
  } catch (error) {
    res.status(400).send(`Creating user error : \n ${error.message}`);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    // .select("-password");
    if (users.length < 1)
      return res.status(404).send("No users found on this site.");

    res.send(`Users account found : \n ${users}`);
  } catch (error) {
    res.status(404).send("Unable to fetch data from the users list.");
  }
};

const myProfile = async (req, res) => {
  res.send(req.user);
};

const updateUser = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid update fields!" });

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("No user with that id found.");

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.send(user);
  } catch (error) {
    res.status(404).send(`Updating user error : ${error}`);
  }
};

const getProfilePicture = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user || !user.avatar) throw new Error("Cannot find profile or image.");

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send("Cannot find user image.");
  }
};

const uploadProfilePicture = async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();
  req.user.avatar = buffer;
  await req.user.save();

  res.send("File uploaded successfully...");
};

const deleteProfilePicture = async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();

  res.send("Deleted successfully...");
};

const deleteUser = async (req, res) => {
  const user = req.user;
  try {
    await user.remove();
    sendCancellationEmail(user);

    res.send(req.user);
  } catch (error) {
    res.status(500).send("Unable to delete user");
  }
};

const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.user.save();
    res.send("User logged out");
  } catch (error) {
    res.status(500).send("Unable to log user out error :");
  }
};

const logoutAllUsers = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token === req.token
    );

    await req.user.save();
    res.send("Users logged out");
  } catch (error) {
    res.status(500).send("Unable to log users out error :");
  }
};

// Task
const getTasks = async (req, res) => {
  const match = {};
  const sort = {};
  const { completed, limit, skip, sortBy } = req.query;

  if (completed) match.completed = completed === "true";

  if (sortBy) {
    const parts = sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    const task = await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(limit),
          skip: parseInt(skip),
          sort,
        },
      })
      .execPopulate();
    if (!task) return res.status(404).send("No tasks found on this site.");

    res.send(`List of tasks found : \n ${task.tasks}`);
  } catch (error) {
    res.status(404).send(`Unable to fetch data from the task list. ${error}`);
  }
};

const createTask = async (req, res) => {
  try {
    const newTask = new Task({
      owner: req.user._id,
      ...req.body,
    });
    if (!newTask)
      return res.status(400).send("There was an error creating a task.");

    await newTask.save();
    res.status(201).send(`New task created successfully : \n ${newTask}`);
  } catch (error) {
    res.status(400).send(`Creating task error : \n ${error.message}`);
  }
};

const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ _id: id, owner: req.user._id }).select(
      "-password"
    );
    if (!task) return res.status(404).send("No task found with that ID.");

    res.send(`Task found : \n ${task}`);
  } catch (error) {
    res.status(500).send("Unable to fetch data from the tasks list.");
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid update fields!" });

  try {
    const task = await Task.findOne({ _id: id, owner: req.user._id });
    if (!task) return res.status(404).send("No user with that id found.");

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(404).send(`Updating task error : ${error}`);
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      owner: req.user._id,
      _id: req.params._id,
    });
    if (!task) return res.status(404).send("No task found with that id.");

    res.send(task);
  } catch (error) {
    res.status(500).send("Unable to delete task");
  }
};

module.exports = {
  getUsers,
  getTasks,
  getTaskById,
  createUser,
  createTask,
  updateUser,
  updateTask,
  deleteUser,
  deleteTask,
  myProfile,
  logoutUser,
  logoutAllUsers,
  getProfilePicture,
  uploadProfilePicture,
  deleteProfilePicture,
};
