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
    (email)=>{ return User.findOne({email: email})},    //Get user by email
    (id) => { return User.findOne({_id: id})}           //Get user by id
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
    if (!req.isAuthenticated()){
        res.render('index', {title: 'dball.io'}); 
    } else{
        const curr_user = { 
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            id: req.user._id, }
        res.render('profile', {title: 'dball.io', user: curr_user, layout: 'dashboard'}); 
    }
});

router.get('/members', async (req, res)=>{
    if (!req.isAuthenticated()){
        res.render('allMembers', {title: 'Current members'});
    } else{
        const members = await User.find({}).lean(); //lean returns plain js object rather than mongoose object
        console.log(`${members}`);
        const curr_user = { 
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            id: req.user._id, }
        res.render('allMembers', {title: 'Current members', user: curr_user, layout: 'dashboard', members: members});
    }
});

router.get('/profile', checkAuthenticated, (req, res)=>{
    const curr_user = { 
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        _id: req.user._id }
    res.render('profile', {layout: 'dashboard',  user: curr_user});
})

router.get('/about', (req, res)=>{
    if (!req.isAuthenticated()){
        res.render('about', {title: 'About'});
    } else{
        const curr_user = { 
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            id: req.user._id, }
        res.render('about', {title: 'About', user: curr_user, layout: 'dashboard'});
    }
});


router.get('/register', (req, res)=>{
    res.render('register', {title: 'Register'});
});

router.get('/login', checkNotAuthenticated, (req, res)=>{
    res.render('login', {title: 'Login'});
});


// [API] For register page
router.post('/registerUser', async (req, res)=> {
    try{
        const findUser = await User.findOne({email: req.body.email}).lean();

        
        if (!findUser){
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
        } else{
            res.json({message: "Duplicate user"});
        }
        

    }catch(err){
        console.log(err);
        res.json(err);
    }
})


// [API] for logging in user
router.post('/loginUser', passport.authenticate('local', {
    successRedirect: '/profile', 
    failureRedirect: '/login',
    failureFlash: true
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

function checkNotAuthenticated(req, res, next){
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

// [API] gets a member by id(string)
router.get('/user/:id', async (req, res)=>{
    if (!req.isAuthenticated()){
        res.render('index', {title: 'dball.io'}); 
    } else{
        const found = await User.findOne({_id: req.params.id}).lean();
        if (!found){
            console.log("user not found.");
        }else{
            const curr_user = { 
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                _id: req.user._id }
            res.render('profile', {layout: 'dashboard',  user: curr_user, new_user: found, redirect: true})
        }   
    }
    
});


module.exports = router;