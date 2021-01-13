const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');

const logger = require('./middleware/logger')

//const members = require('./Members');         //use database
require('dotenv/config');

const app = express();

// Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main', layoutDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

//logger middleware
app.use(logger);

//app.use(express.static(path.join(__dirname, 'public')));

//app.get for pages
//app.use('/', require('./router/router'));

//[api calls]
app.use('/', require('./router/members'))


// Connect to db
mongoose.connect(process.env.DB_CONNECTION, 
    { useNewUrlParser: true, 
    useUnifiedTopology: true},
    (err)=>{
        if (err){
            console.log(err);
        }else{
            console.log("Connected to db")}
        }
);


// listening to port
const port = process.env.PORT || 5000;
const host = process.env.HOST || '127.0.3.1';
app.listen(port, host,  ()=> {console.log(`app has been opened at http://${host}:${port}`);});