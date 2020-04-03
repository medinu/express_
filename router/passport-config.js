const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

function initialize(passport, getUserByEmail, getUserById){
    authenticateUser =async (email, password, done) =>{

        const user = await getUserByEmail(email);

        console.log(`user: ${user}`)

        if(user === null){
            console.log("no user with that email.")
            return done(null, false, {message: 'No user with that email.'});
        }
        try {  
            console.log(`${user._id} is the user id`);
            // if error check link: https://www.npmjs.com/package/bcryptjs
            if (await bcrypt.compare(password , user.password, function(err, res) {
                if (res){
                    console.log("Password matched");
                    return done(null, user);
                }else {
                    console.log(`Entered Password: ${password} \nUser.password: ${user.password}`)
                    console.log("Password did not match")
                    return done(null, false, {message: 'Password incorrect'});
                }
            })){
                    /** if statement */
                //return done(null, user);
            }else{
                //return done(null, false, {message: 'Password incorrect'});
            }
        } catch (err) {
            return done(err);
        }
    } 


    passport.use(new LocalStrategy({ usernameField: 'email'}, 
    authenticateUser))
    passport.serializeUser((user, done)=> done(null, user._id));
    passport.deserializeUser((id, done)=>{
        return done(null, getUserById(id));
    });
}

module.exports = initialize;