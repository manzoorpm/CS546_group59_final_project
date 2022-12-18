// server setup

const express = require("express");
const app = express();
const session = require("express-session");
const static = express.static(__dirname + "/public");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const path = require("path");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const data = require("./data");
const reservationData = data.reservations;

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
  if (req.session.user) {
    return res.redirect("/");
  } else {
    //req.method = "POST";
    next();
  }
});
app.use("/auth/register", async (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  } else {
    next();
  }
});
app.post("/admin/restaurant/add", upload.single("image"), (req, res, next) => {
  next();
});
// app.use("/account/:userId", async (req, res, next) => {
//   if (req.session.userId.toString() == req.params.userId.toString()) {
//     next();
//   } else {
//     return res.redirect("/exceptions/forbidden");
//   }
// });

// app.use("/admin", async (req, res, next) => {
//   if (req.session.userTag == "admin") {
//     next();
//   } else {
//     return res.redirect("/exceptions/forbidden");
//   }
// });

// app.use("/admin/restaurant/add", async (req, res, next) => {
//   if (req.session.userTag !== "admin") {
//     next();
//   } else {
//     return res.redirect("/exceptions/forbidden");
//   }
// });

// app.use("/admin/restaurant/delete", async (req, res, next) => {
//   if (req.session.userTag == "admin") {
//     next();
//   } else {
//     return res.redirect("/exceptions/forbidden");
//   }
// });

app.use("/account/edit/:userId", async (req, res, next) => {
  if (req.session.userId.toString() == req.params.userId.toString()) {
    next();
  } else {
    return res.redirect("/exceptions/forbidden");
  }
});

app.use("/account/remove/:userId", async (req, res, next) => {
  if (req.session.userId == req.params.userId) {
    next();
  } else {
    return res.redirect("/exceptions/forbidden");
  }
});
// app.use("/restaurant/:restauarantId/addreservation", async (req, res, next) => {
//   if (req.session.userTag == "admin") {
//     return res.redirect("/exceptions/forbidden");
//   } else if (req.session.userTag == "user") {
//     next();
//   } else return res.redirect("/auth/login");
// });
app.use("/reservation/:reservationId/", async (req, res, next) => {
  try {
    let reservation = await reservationData.getReservationById();
    if (reservation.userId.toString() == req.params.reservationId) {
      next();
    } else return res.redirect("/exceptions/forbidden");
  } catch (e) {
    return res.redirect("/exceptions/forbidden"); //not found
  }
});
app.use("/reservation/delete/:reservationId/", async (req, res, next) => {
  try {
    let reservation = await reservationData.getReservationById();

    if (reservation.userId.toString() == req.params.reservationId) {
      next();
    } else {
      return res.redirect("/exceptions/forbidden");
    }
  } catch (e) {
    return res.redirect("/exceptions/forbidden"); //not found
  }
});

//update permission for routes
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
