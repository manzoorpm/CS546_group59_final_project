// server setup
const express = require("express");
const app = express();
const session = require("express-session");
const static = express.static(__dirname + "/public");

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const path = require("path");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    helpers: {
      ifEquals: function (arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
      },
    },
  })
);
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/auth/login", async (req, res, next) => {
  if (req.session.user || req.session.admin || req.session.restaurant) {
    return res.redirect("/");
  } else {
    //req.method = "POST";
    next();
  }
});
app.use("/auth/register", async (req, res, next) => {
  if (req.session.user || req.session.admin || req.session.restaurant) {
    return res.redirect("/");
  } else {
    next();
  }
});
app.use("/account/user", async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.redirect("/exceptions/forbidden");
  }
});
app.use("/account/restaurant", async (req, res, next) => {
  if (req.session.restaurant) {
    next();
  } else {
    return res.redirect("/exceptions/forbidden");
  }
});
app.use("/account/admin", async (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    return res.redirect("/exceptions/forbidden");
  }
});
app.use("/dashboards/admin", async (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    return res.redirect("/exceptions/forbidden");
  }
});
app.use("/dashboards/restaurant", async (req, res, next) => {
  if (req.session.restaurant) {
    next();
  } else {
    return res.redirect("/exceptions/forbidden");
  }
});
app.use("/account/user/edit/:userId", async (req, res, next) => {
  if (req.session.userId == req.params.userId) {
    next();
  } else {
    return res.redirect("/exceptions/forbidden");
  }
});
app.use("/account/admin/edit/:adminId", async (req, res, next) => {
  if (req.session.adminId == req.params.adminId) {
    next();
  } else {
    return res.redirect("/exceptions/forbidden");
  }
});
app.use("/account/restaurant/edit/:restaurantId", async (req, res, next) => {
  if (req.session.restaurantId == req.params.restaurantId) {
    next();
  } else {
    return res.redirect("/exceptions/forbidden");
  }
});
app.use("/account/user/remove/:userId", async (req, res, next) => {
  if (req.session.userId == req.params.userId) {
    next();
  } else {
    return res.redirect("/exceptions/forbidden");
  }
});
app.use("/account/admin/remove/:adminId", async (req, res, next) => {
  if (req.session.adminId == req.params.adminId) {
    next();
  } else {
    return res.redirect("/exceptions/forbidden");
  }
});
app.use("/account/restaurant/remove/:restaurantId", async (req, res, next) => {
  if (req.session.restaurantId == req.params.restaurantId) {
    next();
  } else {
    return res.redirect("/exceptions/forbidden");
  }
});
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
