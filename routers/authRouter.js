const router = require('express').Router();
const passport = require('passport');


// Google oAUTH routing
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: process.env.FE_URL,
    failureRedirect: process.env.FE_URL + '?message=401_auth_failure'
}))


module.exports = router;