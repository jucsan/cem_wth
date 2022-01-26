var express = require('express'),
router = express.Router(),
passport = require('passport'),
User = require('../models/users');

router.get("/", function(req, res){
    res.render("landing", {page: 'home'});
});

router.get("/register", function(req, res){
    res.render("user/register", {page: 'register'});
});

router.post("/register", function(req, res){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(req.body.email.length >  0){
        if(re.test(req.body.email) == false){
            req.flash('error', "Please provide a valid email address");
            return res.redirect('/register');
        }
    }
    
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("name", err.name);
            req.flash("error", err.message);
            return res.redirect('/register');
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/stories");
            });
        }
    });
});

router.get("/login", function(req, res){
    req.flash("error");
    res.render("user/login", {page: "login"});
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/success",
        failureRedirect: "/login",
        failureFlash: true,
    }), function(req, res){
});

router.get('/success', function(req, res){
    res.redirect('/user/' + req.user.username);
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/stories");
});

module.exports = router;