// Requiring our models and passport as we've configured it
const passport = require("../passport");
// Import the model (user.js) to use its database functions.
const db = require('../../models');

module.exports = function(app) {
  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
  // route for deleting the user
  app.delete('/api/users/:id', (req,res)=>{
    db.Users.destroy({
      where:{
        id: req.params.id
      }
    }).then(dbUser=> res.status(200).json({msg: "user deleted"}))
    .catch(err=> res.status(500).json(err));
  })

};
