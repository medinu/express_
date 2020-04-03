const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

function initialize(passport, getUserByEmail, getUserById){
    authenticateUser =async (email, password, done) =>{

        const user = await getUserByEmail(email);

        //console.log(`user: ${user}`)

        if(user === null){
            //console.log("no user with that email.")
            return done(null, false, { message: 'No user with that email.' });
        }
        try {  
            //console.log(`${user._id} is the user id`);
            // if error check link: https://www.npmjs.com/package/bcryptjs
            if (await bcrypt.compare(password , user.password)){
                    /** if statement */
                return done(null, user);
            }else{
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (err) {
            return done(err);
        }
    } 


    passport.use(new LocalStrategy({ usernameField: 'email'}, 
    authenticateUser))
    passport.serializeUser((user, done)=> {
        //console.log(`${user} & ${user.id}`);
        done(null, user.id)
    });
    passport.deserializeUser(async (id, done)=>{
        //console.log(`${id}-dederializeUser`);
        
        const user = await getUserById(id);
        //console.log(`user deserial: ${user}`)

        return done(null, user );
    });
}

module.exports = initialize;