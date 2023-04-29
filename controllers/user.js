const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const handleError = require("./utils/errorCatchers");

// * Controller for any user-related requests
const userController = {
  // * register CONTROLLER
  // * - will handle the registration of new user
  // * - for the end point POST | /register
  register: async (req, res) => {
    try {
      const { name, username, email, password } = req.body;

      // * check for pw length
      if (password.length < 6)
        return res.status(400).json({
          success: false,
          message: "Password must be 6 characters or more",
        });

      // * check if email already exists
      // * check if username was already taken
      const emailLowerCase = email.toLowerCase();
      const usernameLowerCase = username.toLowerCase();
      const existedUser = await User.findOne({
        $or: [{ email: emailLowerCase }, { username: usernameLowerCase }],
      });

      if (existedUser) {
        if (existedUser.email === emailLowerCase) {
          return res.status(400).json({
            success: false,
            message: "User already exists with this email address",
          });
        } else if (existedUser.username === usernameLowerCase) {
          return res.status(400).json({
            success: false,
            message: "Username already taken",
          });
        }
      }

      // * hash and storing the encrypted password
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await User.create({
        name: name,
        username: usernameLowerCase,
        email: emailLowerCase,
        password: hashedPassword,
        photoURL: "",
        time_created: new Date(),
        last_modified: new Date(),
        settings: [],
        isActive: true,
      });
      const { _id: id, photoURL, isActive } = user;
      const token = jwt.sign(
        { id, name, username, photoURL, isActive },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // *result
      res.status(201).json({
        success: true,
        message: "Sucessfully registered",
        result: {
          id,
          name,
          username,
          email: user.email,
          photoURL,
          token,
          isActive,
        },
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  // * login CONTROLLER
  // * - will handle the logging in registered user
  // * - for the end point POST | /login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // * check if account with the given email exist
      const emailLowerCase = email.toLowerCase();
      const existedUser = await User.findOne({ email: emailLowerCase });

      if (!existedUser) {
        return res.status(404).json({
          success: false,
          message: "User does not exist",
        });
      }

      // * verify password
      const correctPassword = await bcrypt.compare(
        password,
        existedUser.password
      );

      if (!correctPassword) {
        res.status(400).json({
          success: false,
          message: "Invalid credentials",
          result: null,
        });
      } else {
        const { _id: id, name, username, photoURL, isActive } = existedUser;
        const token = jwt.sign(
          { id, name, username, photoURL, isActive },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({
          success: true,
          message: `Welcome back ${existedUser.username}`,
          result: {
            id,
            name,
            username,
            email: emailLowerCase,
            photoURL,
            token,
            isActive,
          },
        });
      }
    } catch (error) {
      handleError(res, error);
    }
  },

  // * updateProfile CONTROLLER
  // * - will handle the updating of user name, username, and profile image related requests
  // * - for the end point PATCH | /update-profile
  updateProfile: async (req, res) => {
    try {
      // * get user details from db and update fields based on what the fe sent
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { ...req.body, last_modified: new Date() },
        {
          new: true,
        }
      );
      const { _id: id, name, username, photoURL, isActive } = updatedUser;

      const token = jwt.sign(
        { id, name, username, photoURL, isActive },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        success: true,
        message: "Profile successfully updated",
        result: { name, username, photoURL, token },
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  // * deactivation CONTROLLER
  // * - will handle deactivation request as requirement to SOFT DELETION
  // * - will unlink the user to his/her records while he/she is deactivated
  // * - for the end point DELETE | /deactivate
  deactivateUser: async (req, res) => {
    console.log("FROM CONTROLLER", req);
    try {
      // * retrieve user's records from the db, then setting isActive to false
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { ...req.body, isActive: false },
        {
          new: true,
        }
      );
      const { _id: id, name, username, photoURL, isActive } = updatedUser;

      const token = jwt.sign(
        { id, name, username, photoURL, isActive },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      // * result
      res.status(200).json({
        success: true,
        message: "Account successfully deactivated",
        result: { name, username, photoURL, token, isActive },
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  // * reactivation CONTROLLER
  // * - will handle reactivation request
  // * - will relink the user to his/her records
  // * - for the end point PATCH | /reactivate
  reactivateUser: async (req, res) => {
    try {
      // * retrieve user's records from the db, then setting isActive to false
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { ...req.body, isActive: true },
        {
          new: true,
        }
      );
      const { _id: id, name, username, photoURL, isActive } = updatedUser;

      const token = jwt.sign(
        { id, name, username, photoURL, isActive },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      // * result
      res.status(200).json({
        success: true,
        message: `Account successfully reactivated. Welcome back ${username}`,
        result: { name, username, photoURL, token, isActive },
      });
    } catch (error) {
      handleError(res, error);
    }
  },
};

module.exports = userController;
