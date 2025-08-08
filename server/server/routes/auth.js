const router = require('express').Router();
const passport = require('passport');

// Auth with Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'] // What we want to retrieve from Google
}));

// Callback route for Google to redirect to
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login/failed', // A route you can define to handle failed login
    successRedirect: process.env.CLIENT_HOME_PAGE_URL // Redirect to client on success
}));

// Logout
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy((err) => {
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Logged out' });
        });
    });
});

module.exports = router;
