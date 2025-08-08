const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/User');
require('dotenv').config({ path: '../.env' });


// Serialize user to store in session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_ROOT_URI}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
        // This function is called after successful authentication with Google
        try {
            // Check if user already exists in our DB
            let currentUser = await User.findOne({ googleId: profile.id });

            if (currentUser) {
                // Already have this user
                console.log('User is:', currentUser);
                done(null, currentUser);
            } else {
                // If not, create a new user in our DB
                const newUser = await new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value
                }).save();
                console.log('Created new user:', newUser);
                done(null, newUser);
            }
        } catch (err) {
            console.error('Error in Google Strategy:', err);
            done(err, null);
        }
    }
));
