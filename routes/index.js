// index routes
const restaurantRoutes = require("./restaurants");
const authenticationRoutes = require("./authentication");
const accountRoutes = require("./account");
const adminRoutes = require("./admin");
const exceptionRoutes = require("./exceptions");
const reservationRoutes = require("./reservations");

const constructorMethod = (app) => {
  app.use("/", restaurantRoutes);
  app.use("/auth", authenticationRoutes);
  app.use("/account", accountRoutes);
  app.use("/admin", adminRoutes);
  app.use("/exceptions", exceptionRoutes);
  app.use("/reservations", reservationRoutes);

  app.use("*", (req, res) => {
    res.status(404).render("notFound", {
      error: "Not found",
      user: req.session.user,
      userId: req.session.userId,
      userTag: req.session.tag,
      name: req.session.name,
    });
  });
};

module.exports = constructorMethod;
