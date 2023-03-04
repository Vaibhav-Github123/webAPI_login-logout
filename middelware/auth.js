const User = require("../model/User");
const jwt = require("jsonwebtoken");

const auth = async (req, resp, next) => {
  const token = req.cookies.jwt;
  try {
    const userInfo = await jwt.verify(token, "eygfiuekjfsnlc");

    const user = await User.findOne({ _id: userInfo._id });

    const tk = user.Tokens.filter(ele => {
      return ele.token == token;
    });

    if (tk[0] == undefined) {
      resp.render("login", {msg: "invalid credinsial"});
    } else {
      req.user = user;
      req.token = token;
    }
    next();
  } catch (error) {
    resp.render("login", {msg: "invalid credinsial"});

  }
};

module.exports = auth;
