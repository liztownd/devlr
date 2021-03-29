// Requiring our models and passport as we've configured it
const passport = require('../passport');
const isAuthenticated = require('../middleware/isAuthenticated');
// Import the model (user.js) to use its database functions.
const db = require('../../models');

module.exports = function (app) {

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post('/api/signup', (req, res) => {
    console.log(req.body);
    db.Users.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(() => {
        res.redirect(307, '/api/login');
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });
};
