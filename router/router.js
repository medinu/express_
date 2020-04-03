const express = require('express');
const router = express.Router();

router.use(express.json());
//router.use(express.urlEncoded())

/* router.get('/', (req, res)=>{
    res.render('index', {title: 'dball.io'});
});

router.get('/members', (req, res)=>{
    res.render('allMembers', {title: 'Current members'});
});

router.get('/about', (req, res)=>{
    res.render('about', {title: 'About'});
});


router.get('/register', (req, res)=>{
    res.render('register', {title: 'Register'});
});

router.get('/login', (req, res)=>{
    res.render('login', {title: 'Login'});
}); */


module.exports = router;