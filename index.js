const express = require('express');
const path = require('path');
const members = require('./Members');
const logger = require('./middleware/logger.js')

const app = express();

//logger middleware
app.use(logger);

{//static folder
/* app.use(express.static(path.join(__dirname, 'public'))); */
}


// Routing individual pages
//
// http:/localhost:5000/members
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// http:/localhost:5000/members
app.get('/members',function(req, res){
    var a_mod = members.map(ele => `<h1>${ele.first_name} ${ele.last_name} </h1><p> ${ele.first_name} is the ${ele.relation}.</p>`);
    a_mod = a_mod.join('');
    res.send(a_mod)
});
// gets all members
app.get('/api/members', (req, res)=>{
    res.json(members);
});
app.get('/api/member/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id));

    if (found){
        res.json(members.filter(member => member.id === parseInt(req.params.id)));
    } else{
        res.status(400).json({msg: `no member with id of ${req.params.id}`});
    }
    
})


// listening to port
const port = process.env.PORT || 5000;
app.listen(port, ()=> {console.log(`app has been opened at port: ${port}`);});