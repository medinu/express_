const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

function initialize(passport, getUserByEmail, getUserById){
    authenticateUser =async (email, password, done) =>{

        const user = await getUserByEmail(email);

        if(user === null){
            console.log("no user with that email.")
            return done(null, false, { message: 'No user with that email.' });
        }
        try {  
            if (await bcrypt.compare(password , user.password)){
                console.log("Correct password");
                return done(null, user);
            }else{
                console.log("incorrect password");
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (err) {
            return done(err);
        }
    } 


    passport.use(new LocalStrategy({ usernameField: 'email'}, 
    authenticateUser))
    passport.serializeUser((user, done)=> {
        done(null, user.id)
    });
    passport.deserializeUser(async (id, done)=>{
        const user = await getUserById(id);
        return done(null, user);
    });
}

module.exports = initialize;