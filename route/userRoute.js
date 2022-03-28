const route = require("express").Router();
const userCtrl = require("../controller/userCtrl"); //1
const auth = require("../middleware/auth");

route.post("/register", userCtrl.register);
route.post("/login", userCtrl.login);
route.get("/logout", userCtrl.logout);
route.get("/refresh_token", userCtrl.refreshToken);
route.get("/userinfo", auth, userCtrl.getUser);

module.exports = route;
