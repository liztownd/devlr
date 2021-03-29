// Requiring our models and passport as we've configured it
const db = require('../../models');
const passport = require('../../config/passport');
const isAuthenticated = require('../middleware/isAuthenticated');

module.exports = function (app) {
  // Route for logging user out
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};