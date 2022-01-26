var formidable  = require("express-formidable"),
middleware      = require('../middleware/'),
express         = require('express'),
request         = require('request'),
router          = express.Router(),
Story           = require('../models/stories'),
User            = require('../models/users'),
fs              = require('fs');

//aggregate all stories to index page
router.get("/stories", function(req, res){
    Story.findRandom({}, {}, {limit: 10}, function(err, results) {
        if(err){
            console.log(err);
            req.flash('error', err);
            res.redirect('/stories');
        } else {
            // console.log(results);
            res.render("stories/index", {page: 'story', story: results});
        }
    });
});

//display complete story on its own page
router.get("/stories/show/:id", function(req, res){
    Story.findById(req.params.id, function(err, foundStory){
        if(err){
            req.flash('error', 'Sorry, but that story does not seem to exist');
            return res.redirect('/stories');
        } else {
            Story.findRandom({}, {}, {limit: 4}, function(err, results) {
                if(err){
                    console.log(err);
                    req.flash('error', err);
                    res.redirect('/stories');
                } else {
                    console.log(results);
                    res.render("stories/show", {page: 'story', story: results, selected: foundStory});
                }
            });
        }
    })
});

//user profile page
router.get("/user/:username", middleware.foundUser, function(req, res){
    Story.find({'author.username': req.params.username}, function(err, userStory){
        if(err){
            return res.redirect('/stories');
        } else {
            return res.render("user/show", {userStory: userStory, user: req.params.username, page: 'profile'});
        }
    });
});

//add new story page
router.get("/stories/new", middleware.isLoggedIn, function(req, res){
    res.render("stories/new", {user: req.user.username});
});

//submit new story text locally and image to imgur
router.post("/stories", middleware.isLoggedIn,  formidable(), function(req, res){
    if(req.fields.text == false) {
        req.flash("error", "Looks like you're missing your story");
        return res.redirect(req.get('referer'));
    } else if (req.files.image.size == 0) {
        req.flash("error", "Looks like you're missing an image");
        return res.redirect(req.get('referer'));
    } else {
        var formData = {image: fs.createReadStream(req.files.image.path)};
        request.post({
            url: 'https://api.imgur.com/3/image',
            headers: {
                authorization: "Client-Id 84277fdf4f14c95"
            },
            formData: formData,
        }, function callBack(err, httpResponse, body){
            if(err){
                return console.log('upload error', err);
            } else {
                var data = JSON.parse(body);
                // console.log('Upload successful! Server responded with:', data['data']);
                var newStory = {
                    image: data['data']['link'],
                    imageDelete: data['data']['deletehash'],
                    text: req.fields.text,
                    author: {
                        id: req.user._id,
                        username: req.user.username
                    }
                };
                Story.create(newStory, function(err, newlyCreated){
                    if(err){
                        req.flash("name", err.name);
                        req.flash("error", err.message);
                        console.log(err.name);
                        return res.redirect("back");
                    } else {
                        //console.log(newlyCreated);
                        res.redirect("/user/" + req.user.username);
                    }
                });
            }
        });
    }
});

//edit page for story
router.get("/stories/edit/:id", middleware.isLoggedIn, middleware.storyOwner, function(req, res){
    Story.findById(req.params.id, function(err, foundStory){
        if(err){
            req.flash('error', 'Hmm, story was not found');
            res.redirect('/stories');
        } else {
            res.render('stories/edit', {story: foundStory, user: req.user.username});
        }
    });
});

//submit edited story
router.put("/stories/edit/:id", middleware.isLoggedIn, middleware.storyOwner, formidable(), function(req, res){
    function storyUpdate(){
        Story.findByIdAndUpdate(req.params.id, {text: req.fields.text}, function(err, updatedStory){
            if(err){
                console.log(err);
                res.redirect('back');
            } else {
                req.flash('success', 'Story was successfully updated');
                res.redirect('/user/' + req.user.username);
            }
        });
    }

    if(req.fields.text == false){
        req.flash('error', 'Hmm looks like your story is looking a little empty');
        return res.redirect('back');
    } else if(req.files.image.size !== 0) {
        Story.findById(req.params.id, function(err, foundStory){
            if(err){
                req.flash('error', 'Hmmm, looks like there was an error');
                return res.redirect('/user/' + req.user.username);
            } else {
                request.del({
                    url: 'https://api.imgur.com/3/image/' + foundStory.imageDelete,
                    headers: {
                        authorization: "Client-Id 84277fdf4f14c95"
                    },

                }, function(err, httpResponse, body){
                    if(err){
                        console.log(err);
                        return res.redirect('/user/' + req.user.username);
                    } else {
                        console.log(body);
                    }
                });
                var formData = {image: fs.createReadStream(req.files.image.path)};
                request.post({
                    url: 'https://api.imgur.com/3/image',
                    headers: {
                        authorization: "Client-Id 84277fdf4f14c95"
                    },
                    formData: formData,
                }, function callBack(err, httpResponse, body){
                    if(err){
                        return console.log('upload error', err);
                    } else {
                        var data = JSON.parse(body);
                        console.log('Upload successful! Server responded with:', data['data']);
                        var update = {
                            image: data['data']['link'],
                            imageDelete: data['data']['deletehash'],
                            text: req.fields.text,
                        };
                        Story.findByIdAndUpdate(foundStory._id, update, function(err, updatedStory){
                            if(err){
                                req.flash('error', err);
                                res.redirect('/user/' + req.user.username);
                            } else {
                                req.flash('success', 'Story was successfully updated');
                                res.redirect('/user/' + req.user.username);
                            }
                        });
                    }
                });
            }
        });
    } else {
        storyUpdate();
    }

});

//delete story
router.delete("/stories/delete/:id", middleware.isLoggedIn, middleware.storyOwner, function(req, res){
    Story.findById(req.params.id, function(err, foundStory){
        if(err){
            req.flash('error', err);
            res.redirect('/stories');
        } else {
            request.del({
                url: 'https://api.imgur.com/3/image/' + foundStory.imageDelete,
                headers: {
                    authorization: "Client-Id 84277fdf4f14c95"
                },

            }, function(err, httpResponse, body){
                if(err){
                    return console.log(err);
                } else {
                    console.log(body);
                    Story.findByIdAndRemove(req.params.id, function(err){
                        if(err){
                            res.redirect("/stories");
                        } else {
                            req.flash('success', 'Story was successfuly deleted');
                            res.redirect("/user/" + req.user.username);
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
