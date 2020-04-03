if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const User = require('../models/user');
const initializePassport = require('./passport-config');

initializePassport(
    passport, 
    (email)=>{ return User.findOne({email: email})},
    (id) => { return User.findOne({_id: id})}
);

router.use(express.json());
router.use(express.urlencoded({extended: false})); 

router.use(flash());
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride('_method'));


router.get('/', (req, res)=>{
    res.render('index', {title: 'dball.io'});
});

router.get('/members', (req, res)=>{
    res.render('allMembers', {title: 'Current members'});
});

router.get('/profile', checkAuthenticated, (req, res)=>{
    console.log(req.users);
    res.render('memberProfile', { name:  req});
})

router.get('/about', (req, res)=>{
    res.render('about', {title: 'About'});
});


router.get('/register', (req, res)=>{
    res.render('register', {title: 'Register'});
});

router.get('/login', checkNotAunthicated, (req, res)=>{
    res.render('login', {title: 'Login'});
});


// [API] For register page
router.post('/registerUser', async (req, res)=> {
    try{
        const hashedPassword = await bcrypt.hashSync(req.body.password, 8);
        const newMember = new User({
            //id: Date.now().toString(),
            firstName: req.body.firstName, 
            lastName: req.body.lastName, 
            email: req.body.email,
            password: hashedPassword
        });

        newMember.save()
        .then(data=>{
            res.status(200).redirect('/');
        }).catch(err=>{
            res.json({message: error})
        })
    }catch(err){
        console.log(err);
        res.json(err);
    }
})


// [API] for logging in user
router.post('/loginUser', passport.authenticate('local', {
    successRedirect: '/profile', 
    failiureRedirect: '/login',
    failiureFlash: true
    })
)

router.delete('/logout', (req, res)=>{
    req.logOut();
    res.redirect('/');
})


function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }

    return res.redirect('/')
}

function checkNotAunthicated(req, res, next){
    if (req.isAuthenticated()){ 
        return res.redirect('/');
    }
    next();
}































// [API] edits a member by id
router.put('/:id', (req, res) => {
    const found = members.some(member => member.id === req.params.id);

    if (found){
        const newMember = req.body;

        members.forEach(member => {
            if (member.id === req.params.id){
                member.first_name = newMember.first_name ? newMember.first_name : member.first_name;
                member.last_name = newMember.last_name ? newMember.last_name : member.last_name;
                member.relation = newMember.relation ? newMember.relation : member.relation;

                res.json({msg: "member updated", member});
            }
        });
        res.json(members.filter(member => member.id === parseInt(req.params.id)));
    } else{
        res.status(400).json({msg: `no member with id of ${req.params.id}`});
    }
    
});

// [API] deletes a member by id(string)
router.delete('/:id', (req, res)=>{
    const found = members.some(member => member.id === req.params.id);
    
    const idx = members.findIndex(obj => obj.id === req.params.id );

    members.splice(idx, 1);

    if (found){
        
        res.json({
            msg: "member has been deleted",
            members: members.filter(member => member.id !== req.params.id)
        });
    }else{
        res.status(400).json({msg: `no member exists with the id of ${req.params.id}`});
    }

});


module.exports = router;