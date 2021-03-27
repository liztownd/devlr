
const db = require('../../models');
const passport = require("../passport");
const path = require("path");
const isAuthenticated = require("../middleware/isAuthenticated");
require('dotenv').config();
const axios = require('axios');

module.exports = function (app) {
    //route to get all profiles
    app.get('/api/profiles', isAuthenticated, (req, res) => {
        db.Profile.findAll({
            include: [db.Users]
        })
            .then(dbProfiles => res.status(200).json(dbProfiles))
            .catch(err => res.status(404).json({ msg: "cannot find profiles!" }))
    });

    //route to get a single post for a user
    app.get('/api/profiles/:id', isAuthenticated, (req, res) => {
        // Here we add an "include" property to our options in our findOne query
        // We set the value to an array of the models we want to include in a left outer join
        // In this case, just db.Users
        db.Profile.findOne({
            where: {
                id: req.params.id,
            },
            include: [db.Users],
        }).then((dbProfile) => res.json(dbProfile))
            .catch(err => res.status(404).json({ msg: "cannot find a post for this id!" }))
    });

    // route to post the profile
    app.post('/api/profiles', isAuthenticated, (req, res) => {
        const body = req.body;
        db.Users.findOne(
            {
                where: {
                    id: body.UserId
                }
            })
            .then(() => db.Profile.create(body))
            .then(dbProfile => db.Profile.findOne({
                where: { id: dbProfile.id },
                include: [db.Users]
            }))
            .then(data => {
                res.status(200).json(data);

            })
            .catch(err => res.status(404).json(err))
    });


    //  route for deleting the profile
    app.delete('/api/profiles/:id', isAuthenticated, (req, res) => {
        db.Profile.destroy({
            where: {
                id: req.params.id
            }
        }).then(dbProfile => req.status(200).json(dbProfile))
            .catch(err => res.status(500).json(err))
    })
    //route for updating the profile
    app.put('/api/profiles/:id', isAuthenticated, (req, res) => {
        db.Profile.update(req.body, {
            where: {
                id: req.params.id
            },
        }).then(dbProfile => res.status(200).json(dbProfile))
            .catch(err => res.status(500).json(err))
    });

    //route for getting git repositories once we get gitusername from the profile
    app.get('/github/:username', isAuthenticated, async (req, res) => {
        try {

            const uri = encodeURI(
                `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
            );
            const headers = {
                'user-agent': 'node.js',
                Authorization: process.env.GIT_TOKEN
            };
            const gitHubResponse = await axios.get(uri, { headers });
            return res.json(gitHubResponse.data);
        } catch (error) {
            console.log(error);
            return res.status(404).json({ msg: "No github profile found" });
        }
    });

    // route for adding languages to profile
    app.put('/api/users/languages/:UserId', isAuthenticated, (req, res) => {
        console.log(req.body.lang);
        console.log(req.params.UserId);


        db.Profile.update({
            languages: req.body.lang
        },
            {
                where: {
                    UserId: req.params.UserId,
                },
            }).then((dbProfile) => res.status(200).json(dbProfile))
            .catch((err) => res.status(500).json(err))
    })

    //route for adding theme to profile
    app.put('/api/users/:UserId/color', isAuthenticated, (req, res) => {
        console.log(req.body);

        db.Profile.update({
            themePref: req.body.color,
        },
            {
                where: {
                    UserId: req.params.UserId,
                },
            }).then((dbProfile) => res.status(200).json(dbProfile))
            .catch((err) => res.status(500).json(err))
    });

    app.get('/api/users/:UserId', isAuthenticated, (req, res) => {
        db.Profile.findOne({
            where: {
                UserId: req.params.UserId,
            },
        }).then((dbProfile) => res.status(200).json(dbProfile))
        .catch((err) => res.status(500).json(err));
    });


    // to get ids for featured dev for loop
    app.get('/api/devs/profiles', isAuthenticated, (req, res) => {
        db.Profile.findAll({
            attributes: ['name', 'gitUserName', 'profilePic', 'UserId' ],
        })
            .then(count => res.status(200).json(count))
            .catch(err => res.status(404).json({ msg: "cannot find profiles!" }))
    });


    // send profile pic urls to db
    app.put(`/api/users/pic/:gitUserName`, isAuthenticated, (req, res) => {
        db.Profile.update({
            profilePic: req.body.profilePic
        },
            {
                where: {
                    gitUserName: req.params.gitUserName,
                },
            }).then((dbProfile) => res.status(200).json(dbProfile))
            .catch((err) => res.status(500).json(err))
    });

    //view profile html route
    app.get('/:UserId', isAuthenticated, (req, res) => {
        const UserId = req.params.UserId;
        res.render('profile', { UserId });
      });
    


}
