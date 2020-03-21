const express = require('express')
const port = 5000;

const app = express();

let a = [   ["Thomas", "Wayne",   'father'], 
            ["Martha",   "Wayne",   'mother'], 
            ["Bruce",  "Wayne",   'youngest son'],
            ["Arthur",  "Wayne",   'oldest son']];
            
a = a.map(ele => `<h1>${ele[0]} ${ele[1]}</h1><p> ${ele[0]} is the ${ele[2]}.</p>`);
a = a.join('');


console.log(`app has been opened at port: ${port}`)

app.get('/',function(req, res){
    res.send("hello World")
});

app.get('/members',function(req, res){
    res.send(a)
});

app.listen(port);