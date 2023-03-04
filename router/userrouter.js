const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const auth = require("../middelware/auth");

router.get("/", (req, resp) => {
  resp.render("index");
});

router.post("/adduser", async (req, resp) => {
  try {
    const data = new User(req.body);
    await data.save();
    resp.render("index", { msg: "Ragistasction successfully..!!" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/viewuser", auth,async (req, resp) => {
  try {
    const data = await User.find();
    resp.render("viewuser", { udata: data });
  } catch (error) {
    console.log(error);
  }
});

router.get("/delete", async (req, resp) => {
  const _id = req.query.did;
  try {
    await User.findByIdAndDelete(_id);
    resp.redirect("viewuser");
  } catch (error) {
    console.log(error);
  }
});

router.get("/update", async (req, resp) => {
  const id = req.query.uid;
  try {
    const data = await User.findOne({ _id: id });
    resp.render("updateuser", { data: data });
  } catch (error) {
    console.log(error);
  }
});

router.post("/updateuser", async (req, resp) => {
  try {
    const data = await User.findByIdAndUpdate(req.body.id, {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
    });
    await data.save();
    resp.redirect("viewuser");
  } catch (error) {
    console.log(error);
  }
});



router.get("/loginpage", (req, resp) => {
  resp.render("login")
})


router.post("/login", async (req, resp) => {
  try {
    const user = await User.findOne({email: req.body.email})

    const isvalid = await bcrypt.compare(req.body.password, user.password)
    

    if (isvalid) {
      const token = await user.generateToken()
      console.log(token);
      resp.cookie("jwt", token)
      resp.redirect("viewuser")
    } else {
      resp.render("login",{msg: "Invalid email or password"})
    }

  } catch (error) {
    resp.render("login",{msg: "Invalid email or password"})

  }
})


router.get("/logout",auth, async (req, resp) => {
  try {
    const user = req.user
    const token = req.token


    user.token = user.Tokens.filter(ele => {
      return ele.token != token
    })

    await user.save()
    resp.clearCookie("jwt")
    resp.render("login")

  } catch (error) {
    console.log(error);
  }
})


router.get("/logoutall", auth,async (req, resp) => {
  try {
    const user = req.user
    
    user.Tokens = [];

    await user.save()
    resp.clearCookie("jwt")
    resp.render("login")

  } catch (error) {
    console.log(error);
  }
})
module.exports = router;
