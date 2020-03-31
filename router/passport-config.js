const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs');


async function initialize(passport, getUserByEmail){
    authenticateUser = (email, password, done) =>{
        const user = getUserByEmail(email);

        if(user == null){
            return done(null, false, {message: 'No user with that email.'});
        }
        try {
            // if error check link: https://www.npmjs.com/package/bcryptjs
            if (await bcrypt.compare("password", user.password, function(err, res) {res === true })){
            //if (await bcrypt.compare("password", user.password)){
                return done(null, user);
            }else{
                return done(null, false, {message: 'Password incorrect'});
            }
        } catch (err) {
            return done(err);
        }
    } 
    passport.use(new LocalStrategy({ usernameField: 'email'}), 
    authenticateUser)
    passport.serializeUser((user, done)=>{ });
    passport.deserializeUser((id, done)=>{ });
}

modules.exports = initialize;