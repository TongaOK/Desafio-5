import { Router } from "express";
import UserModel from "../models/user.model.js";

const router = Router();

router.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/api/sessions/login");
  }
  console.log(req.session.user);
  res.render("profile", { title: "Profile", user: req.session.user });
});

router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/api/sessions/profile");
  }

  res.render("login", { title: "Login" });
});

router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/api/sessions/profile");
  }
  res.render("register", { title: "Register" });
});

router.post("/register", async (req, res) => {
  const { body } = req;



  const newUser = await UserModel.create(body);


  await newUser.save();

  console.log("newUser", newUser);
  res.redirect("/api/sessions/login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  const isAdmin =
    email === "adminCoder@coder.com" && password === "adminCod3r123";

  if (isAdmin) {
    user.role = "admin";
  }

  if (!user) {
    return res.status(401).send("Correo o contraseña invalidos 😨.");
  }

  const isPassValid = user.password === password;
  if (!isPassValid) {
    return res.status(401).send("Correo o contraseña invalidos 😨.");
  }

  const { first_name, last_name } = user;
  req.session.user = { first_name, last_name, email, role: user.role };
  res.redirect("/api/products");
});



router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    res.redirect("/api/sessions/login");
  });
});

export default router;
