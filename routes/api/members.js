const express = require('express');
const router = express.Router();
const members = require('../../Members');


// [API] gets all members
router.get('/', (req, res)=>{
    res.json(members);
});

// [API] gets a member by id
router.get('/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id));

    if (found){
        res.json(members.filter(member => member.id === parseInt(req.params.id)));
    } else{
        res.status(400).json({msg: `no member with id of ${req.params.id}`});
    }
    
});

// New member
router.post('/', (req, res)=> {
    

    res.send(req.body);
})

module.exports = router;