
const db = require('../../models');
require('dotenv').config();
const axios= require('axios');
module.exports= function(app){
    //route to get all profiles
    app.get('/api/profiles', (req,res)=>{
         db.Profile.findAll({
             include: [db.Users]
         })
        .then(dbProfiles => res.status(200).json(dbProfiles))
        .catch(err=> res.status(404).json({msg: "cannot find profiles!"} ))
        });

        //route to get a single post for a user 
    app.get('/api/profiles/:id', (req, res) => {
        // Here we add an "include" property to our options in our findOne query
        // We set the value to an array of the models we want to include in a left outer join
        // In this case, just db.Users
        db.Profile.findOne({
          where: {
            id: req.params.id,
          },
          include: [db.Users],
        }).then((dbProfile) => res.status(200).json(dbProfile))
        .catch(err=> res.status(404).json({msg: "cannot find a post for this id!"}))
      });

    // route to post the profile
    app.post('/api/profiles', (req, res) => {
        const body = req.body;
        console.log(body)
        db.Users.findOne(
          {
           where: {
               id: body.UserId
           }
          })
      .then(()=>db.Profile.create(body))
      .then(dbProfile=>db.Profile.findOne({
          where: {id: dbProfile.id},
          include: [db.Users]
      }))
      .then(data=> {res.status(200).json(data);
        console.log(data)
    })
      .catch(err=> res.status(404).json({msg: "user does'nt exist with this userId"}) )
    });

    
//  route for deleting the profile
    app.delete('/api/profiles/:id', (req,res)=>{
        db.Profile.destroy({
            where: {
             id: req.params.id
            }
        }).then(dbProfile=> req.status(200).json(dbProfile))
        .catch(err=> res.status(500).json({msg: "internal server error"}))
    })
    //route for updating the profile
    app.put('/api/profiles/:id',(req,res)=>{
        db.Profile.update(req.body,{
         where:{
             id: req.params.id
         },
        }).then(dbProfile=> res.status(200).json(dbProfile))
        .catch(err=> res.status(500).json({msg: "internal server error"}))
    });

    app.get('/github/:username',async (req,res)=>{
        try {
              
            const uri = encodeURI(
                `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
              );
              const headers = {
                'user-agent': 'node.js',
                Authorization: process.env.GIT_TOKEN
              }; 
              const gitHubResponse = await axios.get(uri,{ headers });
              return res.json(gitHubResponse.data);
        } catch (error) {
            console.log(error);
            return res.status(404).json({msg: "No github profile found"});
        }
    })

}
