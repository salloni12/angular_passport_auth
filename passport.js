var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User =require('./user');

var passport =function(app, passport) {

    app.use(passport.initialize());
    app.use(passport.session());
    
    
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.email);
    });

    // used to deserialize the user
    passport.deserializeUser(function(email, done) {
        User.findOne(email, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({

        clientID        : "96776627974-sodpfro24s0cn6dkfppb4t37grvp5jm5.apps.googleusercontent.com",
        clientSecret    : "t05CHD_TfvcLaDjgeyf2U5tt",
        callbackURL     : "http://localhost:3000/auth/google/callback",

    },
    function(token, refreshToken, profile, done) {
        console.log(profile);
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'email' : profile.emails[0].value }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    console.log(profile);
                    newUser.name  = profile.displayName;
                    newUser.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));

// Redirect the user to google for authentication.  When complete,
// google will redirect the user back to the application at /auth/google/callback
    
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.


// the callback after google has authenticated the user
app.get('/auth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/login'
        }));


};

module.exports =passport;