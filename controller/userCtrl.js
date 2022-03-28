const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const userCtrl = {
  register: async (req, res) => {
    try {
      //validating with model
      let { name, email, password, mobile } = req.body;
      const mob = await User.findOne({ mobile });
      if (mob)
        return res.status(400).json({ msg: "mobile number already exists" });

      const newEmail = await User.findOne({ email });
      if (newEmail)
        return res.status(400).json({ msg: "email already exists." });

      if (password.length < 6)
        return res.status(400).json({ msg: "Password must be six characters.." });
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = User({
        name,
        email,
        password: passwordHash,
        mobile,
      });
      // res.json({ resgister: newUser });
      await newUser.save();
      return res.status(200).json({ msg: "User registered Successfully." });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  login: async (req, res) => {
    try {
      let { email, password } = req.body;
      const user = await User.findOne({ email });
          if (!user) return res.status(400).json({ msg: "Email already exists." });

      const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return res.status(400).json({ msg: "password Incorrect." });

        const accessToken = createAccessToken({id:user._id});
        const refreshToken = createRefreshtoken({id:user._id});

        res.cookie('refreshtoken', refreshToken,{
          httpOnly:true,
          path:'/auth/refresh_token',
          maxAge:7 * 24 * 60 * 60 * 1000
        })

      res.json({accessToken});
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie('refreshtoken', {path:'/auth/refresh_token'});
      return res.status(200).json({msg:"logout Successfully."})
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },
  getUser: async (req, res) => {
    try {
      // res.json({"output": req.user})
      const user = await User.findById(req.user.id).select("-password");
        if(!user) 
            return res.status(400).json({msg:"User data doesn't exists."})
          res.json({"data":user})
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },
  refreshToken: async (req, res) => {
    try {
      //used for session management
      // res.json("refresh token works.");
      const ref_token = req.cookies.refreshtoken;
      if(!ref_token) 
          return res.status(400).json({msg:"Need To Login"});

      jwt.verify(ref_token, process.env.REFRESH_TOKEN_SECRET || require('../config.json').config.refresh_token , (err,user) => {
        if(err)
           return res.status(400).json({msg:"session expired...Need To Login Again."});
       
        const accessToken = createAccessToken({id:user.id});
        res.json({accessToken})
      })
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },
};


const createAccessToken = (user) => {
  return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET || require('../config.json').config.access_token, {expiresIn:"1d"});
}

const createRefreshtoken = (user) => {
  return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET || require('../config.json').config.refresh_token , {expiresIn:"1d"})
}
module.exports = userCtrl;
