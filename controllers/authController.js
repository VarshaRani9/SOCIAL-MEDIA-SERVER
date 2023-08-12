const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
const { error, success } = require("../utils/responseWrapper");

const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Requirements
    if (!email || !password || !name) {
      return res.send(error(400, "All fiels are required"));
    }
    // Validations

    // Already existing user
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send(error(409, "user is already registered"));
    }

    // password hiding
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
      return res.send(success(201, "user created!"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // requirements
    if (!email || !password) {
        return res.send(error(400, "All fiels are required"));
    }

    // existing user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return res.send(error(404, "user is not registered"));
    }

    // comparison
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.send(error(403, "incorrect password"));
    }
    const accessToken = generateAccessToken({
      _id: user._id,
    });
    const refreshToken = generateRefreshToken({
      _id: user._id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, { accessToken }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

//  this API willcheck the validity of refresh token & generate a new access token
const refreshAccessTokenController = async(req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    // return res.status(401).send("Refresh token in cookie is required");
    return res.send(error(401, "Refresh token in cookie is required"));
  }
  const refreshToken = cookies.jwt;

    try {
        const decoded = jwt.verify(
            refreshToken,
          process.env.REFRESH_TOKEN_PRIVATE_KEY
        );
        const _id = decoded._id;
        const accessToken = generateAccessToken({_id});
          return res.send(success(201,{accessToken}));
      } catch (e) {
        console.log(e); 
        return res.send(error(401, "invalid access key "));
      }
}

//internal functions
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1d",
    });
    return token;
  } catch (e) {
    console.log(e);
  }
};

const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    return token;
  } catch (e) {
    console.log(e);
  }
};

const logoutController = async (req, res) => {
  try {
      res.clearCookie('jwt', {
          httpOnly: true,
          secure: true,
      })
      return res.send(success(200, 'user logged out'))
  } catch (e) {
      return res.send(error(500, e.message));
  }
}

module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
  logoutController
};
