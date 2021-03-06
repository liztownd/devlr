// Requiring our models and passport as we've configured it
const passport = require('../passport');
const isAuthenticated = require('../middleware/isAuthenticated');
// Import the model (user.js) to use its database functions.
const db = require('../../models');

module.exports = function (app) {
  // Route for getting some data about our user to be used client side
  app.get('/api/user_data', (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    };
  });

  // route for deleting the user
  app.delete('/api/users/:id', (req, res) => {
    db.Users.destroy({
      where: {
        id: req.params.id
      }
    }).then(dbUser => res.status(200).json({ msg: "user deleted" }))
      .catch(err => res.status(500).json(err));
  });

  //route to get profile for the current loggedin user
  app.get('/api/users/:id', (req, res) => {
    db.Users.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Profile, db.Post]
    }).then((data) => res.status(200).json(data))
      .catch(err => res.status(500).json(err))
  });

  //route to get all users with their profile and users
  app.get('/api/users', (req, res) => {
    db.Users.findAll({
      include: [db.Profile, db.Post],
    }).then(data => res.status(200).json(data))
      .catch(err => res.status(500).json(err));
  });

};
