const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

/* const initializePassport = require('./passport-config');

initializePassport(passport, async (email)=>{

}); */

const User = require('../models/user');


router.use(express.json());
router.use(express.urlencoded({extended: false})); 

// [API] For register page
router.post('/registerUser', async (req, res)=> {
    try{
        const hashedPassword = await bcrypt.hashSync(req.body.password, 8);
        const newMember = new User({
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



// [API]for auhthentication user
router.post('/loginUser', (req, res)=> {
    const newMember = {
        email: req.body.email,
        password: req.body.password
    }

    /* if(!newMember.email || !newMember.password){
        return res.status(400).json({msg: 'Please include a email and/or password.'});
    }  */

    User.findOne({email: newMember.email, password: newMember.password},(err, user)=>{
            if (err){
                console.log(err);
                return res.status(500).send();
            }
            if (!user){
                return res.status(404).send();
            }
                return res.status(200).send();
        })

    res.json(newMember);
    //res.redirect('/');
})
































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