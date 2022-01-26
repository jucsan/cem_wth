var User = require("../models/users");
var Story = require("../models/stories");
var middlewareObj = {};


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "You must be logged in to do that.");
        return res.redirect("/login");
    }
};

middlewareObj.foundUser = function(req, res, next){
    //check to see if user exists
    User.find({username: req.params.username}, function(err, foundUser){
        if(err || foundUser == false){
            req.flash("error", "Hmm, looks like there was an error");
            return res.redirect("/stories");
        } else {
            //make sure that user has the proper credentials
            if(req.isAuthenticated() && req.params.username == req.user.username){
                return next();
            } else {
                req.flash("error", "Sorry, but you don't have the correct credentials");
                return res.redirect("/stories");
            }
        }
    });
};

middlewareObj.storyOwner = function(req, res, next){
    Story.findById(req.params.id, function(err, foundStory){
        if(err){
            req.flash('error', err);
            return res.redirect('/stories');
        } else {
            if(foundStory.author.username !== req.user.username){
                req.flash("error", "Sorry, but you don't have the corrent credentials");
                res.redirect('/stories');
            } else {
                return next();
            }
        }
    });
};

module.exports = middlewareObj;