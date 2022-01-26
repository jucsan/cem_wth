var methodOverride  = require("method-override"),
localStrategy       = require("passport-local"),
bodyParser          = require("body-parser"),
mongoose            = require("mongoose"),
passport            = require("passport"),
express             = require("express"),
helmet              = require("helmet"),
flash               = require("connect-flash"),
app                 = express();

//models
var Story   = require("./models/stories"),
User        = require("./models/users");

//middleware
var middleware = require("./middleware/index");

//mongoose, bodyparser, ejs, css, and override connect
mongoose.connect(process.env.DATABASEURL, {
    useMongoClient: true,    
});

mongoose.Promise = global.Promise;

//npm packages setup
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        styleSrc: ["'self'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "https://i.imgur.com", "blob:"],
        scriptSrc: ["'self'",],
    }
}));
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//==========

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "S5vtNgqgwyOQizH",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Local variables
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.name = req.flash("name");
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//ROUTES
var indexRoutes = require('./routes/index'),
storyRoutes     = require('./routes/stories');

app.use(indexRoutes);
app.use(storyRoutes);

app.get("*", function(req, res){
    req.flash('error', 'Sorry, but that page does not exist');
    res.redirect('/stories');
});

//SERVER SETUP
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("CEM is running");
});