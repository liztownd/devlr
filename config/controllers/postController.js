const db = require('../../models');
const passport = require("../passport");
const isAuthenticated = require("../middleware/isAuthenticated");

module.exports = function (app) {

  // route to get all posts

  app.get('/api/posts', isAuthenticated, (req, res) => {
    db.Post.findAll({
      include: [db.Users]
    })
      .then(dbPosts => res.status(200).json(dbPosts));
  })
  //route to get a single post for a user
  app.get('/api/posts/:id', isAuthenticated, (req, res) => {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Author
    db.Post.findOne({
      where: {
        id: req.params.id,
      },
      include: [db.Users],
    }).then((dbPost) => res.status(200).json(dbPost))
      .catch(err => res.status(404).json({ msg: "cannot find a post for this id!" }))
  });

  //post route for adding a new post
  app.post('/api/posts', isAuthenticated, (req, res) => {
    const body = req.body;
    db.Users.findOne(
      {
        where: {
          id: body.UserId
        }
      })
      .then(() => db.Post.create(body))
      .then(dbPost => db.Post.findOne({
        where: { id: dbPost.id },
        include: [db.Users]
      }))
      .then(dbPost => res.status(200).json(dbPost))
      .catch(err => res.status(404).json(err))
  });


  // DELETE route for deleting posts
  app.delete('/api/posts/:id', isAuthenticated, (req, res) => {
    db.Post.destroy({
      where: {
        id: req.params.id,
      },
    }).then((dbPost) => res.status(200).json({ msg: "post deleted!" }))
      .catch((err) => res.status(500).json({ msg: "server error" }));
  });

  // PUT route for updating posts
  app.put('/api/posts/:id', isAuthenticated, (req, res) => {
    db.Post.update(req.body, {
      where: {
        id: req.params.id,
      },
    }).then((dbPost) => res.json(dbPost))
      .catch(err => res.status(500).json({ msg: "server error" }))
  });

}