const db = require('../../models');


module.exports= function(app){

    // route to get all posts
    app.get('/api/posts', (req,res)=>{
    const query= {};
    if(req.query.user_id){
        query.UserId = req.query.user_id;
    }
        db.POST.findAll({
            where: query,
            include: [db.Users],

        }).then(dbPost => res.status(200).json(dbPost));
    });
    
    //route to get a single post for a user 
    app.get('/api/posts/:id', (req, res) => {
        // Here we add an "include" property to our options in our findOne query
        // We set the value to an array of the models we want to include in a left outer join
        // In this case, just db.Author
        db.Post.findOne({
          where: {
            id: req.params.id,
          },
          include: [db.Users],
        }).then((dbPost) => res.status(200).json(dbPost));
      });

      //post route for adding a new post
      app.post('/api/posts', (req, res) => {
          const body = req.body;
          db.Users.findOne(
            {
             where: {
                 id: body.UserId
             }
            })
        .then(()=>db.Post.create(body))
        .then(dbPost=>db.Post.findOne({
            where: {id: dbPost.id},
            include: [db.Users]
        }))
        .then(dbPost=> res.status(200).json(dbPost))
        .catch(err=> res.status(404).json({msg: "user does'nt exist with this userId"}) )
      });
// app.post('/api/posts', (req, res) => {
//     db.Post.create(req.body).then((dbPost) => res.json(dbPost));
//   });

// DELETE route for deleting posts
app.delete('/api/posts/:id', (req, res) => {
    db.Post.destroy({
      where: {
        id: req.params.id,
      },
    }).then((dbPost) => res.status(200).json({msg: "post deleted!"}))
    .catch((err)=> res.status(500).json({msg: "server error"}));
  });

  // PUT route for updating posts
  app.put('/api/posts', (req, res) => {
    db.Post.update(req.body, {
      where: {
        id: req.body.id,
      },
    }).then((dbPost) => res.json(dbPost));
  });

 }