const express = require('express');
const path = require('path');
const logger = require('./middleware/logger')

const app = express();

//logger middleware
//app.use(logger);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: false})); 

//static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/members', require('./routes/api/members'))


// listening to port
const port = process.env.PORT || 5000;
app.listen(port, ()=> {console.log(`app has been opened at port: ${port}`);});