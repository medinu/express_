const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const members = require('../../Members');


// Crud API [create, read, update and delete]


// [API] Gets all members
router.get('/', (req, res)=>{
    res.json(members);
});

// [API] Gets a member by id
router.get('/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id));

    if (found){
        res.json(members.filter(member => member.id === parseInt(req.params.id)));
    } else{
        res.status(400).json({msg: `no member with id of ${req.params.id}`});
    }
    
});

// [API] Adds New member
router.post('/', (req, res)=> {
    const newMember = {
        id: uuid.v4(), 
        first_name: req.body.first_name, 
        last_name: req.body.last_name, 
        relation: req.body.relation,
        status: 'active'
    }

    if(!newMember.first_name){
        return res.status(400).json({msg: 'Please include a firstname.'});
    } 

    members.push(newMember);

    res.json(members);
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