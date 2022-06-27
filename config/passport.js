const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { dbQuery, dbConf } = require('./database');
const { hashPassword, createToken } = require('./encription');
const { transporter } = require('./nodemailer');

const GOOGLE_CLIENT_ID = process.env.GCLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GCLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // console.log("PROFILE from google", profile);
        // Memriksa apakah user sudah terdaftar
        let login = await dbQuery(`Select iduser,username,email,role, status FROM users 
        WHERE email='${profile.emails[0].value}' AND password='${hashPassword(profile.id)}' ;`);

        if (login.length == 1) {
            // Generate token
            let { iduser, username, email, role, status } = login[0];

            let token = createToken({ iduser, username, email, role, status }, "1h");

            // Mengirimkan email login
            await transporter.sendMail({
                from: "Admin Commerce",
                to: profile.emails[0].value,
                subject: "Login by Google Account",
                html: `<div> 
                <h3>Click Link Below :</h3>
                <a href="${process.env.FE_URL}?otkn=${token}">Login Account Here</a>
                </div>`
            })
        } else {
            // from progile argument google, we action to regis the user
            let regis = await dbQuery(`insert into users (username, email, password, role)
            values (${dbConf.escape(profile.displayName)},${dbConf.escape(profile.emails[0].value)},
            ${dbConf.escape(hashPassword(profile.id))},${dbConf.escape('user')});`)

            if (regis.insertId) {
                let resultsLogin = await dbQuery(`Select iduser,username,email,role, status FROM users 
                WHERE iduser=${regis.insertId};`);
                if (resultsLogin.length == 1) {
                } else {
                    throw 'User not found'
                }
            }
        }


        return done(null, profile);
    } catch (error) {
        console.log(error)
    }
}));

passport.serializeUser((user, cb) => {
    console.log("serializeUser", user)
    cb(null, user);
})

passport.deserializeUser((obj, cb) => {
    console.log("deserializeUser", obj)
    cb(null, obj);
})