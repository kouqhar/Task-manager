const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const { jwtSecretKey, hashAlgorithm } = require("../config/keys");
const { Task } = require("./Task");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!isEmail(value))
          throw new Error("You must provide a valid email address");
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      trim: true,
      validate(value) {
        const regExp = /password/gi;
        const result = regExp.test(value);
        if (result)
          throw new Error('Password field cannot contain the word "PASSWORD"');
      },
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 0) throw new Error("Age cannot input a negative number!");
      },
    },
    avatar: {
      type: Buffer,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// Setting up a virtual environment
userSchema.virtual("tasks", {
  ref: "task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

// Create method on the user instance
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = sign({ _id: user._id.toString() }, jwtSecretKey, {
    // expiresIn: 60 * 60,
    algorithm: hashAlgorithm,
  });
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// Create usable method on the User
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password!!!");

  const { password: userPassword } = user;
  const passwordMatch = await compare(password, userPassword);

  if (!passwordMatch) throw new Error("Invalid email or password");

  return user;
};

// Hash the plaintext password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password"))
    user.password = await hash(user.password, 10);

  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({
    owner: user._id,
  });
  next();
});

const User = model("user", userSchema);

module.exports = { User };
