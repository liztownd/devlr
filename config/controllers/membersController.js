// Requiring our models and passport as we've configured it
const router = express.Router();
// Import the model (user.js) to use its database functions.
const db = require('../models/user');
const passport = require("../../config/passport");
// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../middleware/isAuthenticated");

module.exports = function(app) {
  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  router.get("/members", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../../views/members.handlebars"));
  });
};
