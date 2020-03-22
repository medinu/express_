# Making the best out of the quarentine
___

## Learning Log

### 3/21/20
* Started with a basic express app
* Used the express.static function to generate a couple of static sites.
    * note: Any error in the html file will render the html file useless and will generate an empty page
* logger middleware and moment was used to log everytime a page is accessed. 
* separate files and folders are used to make the directory more structured (still need time to be familiar with it.)
* major note: 
    * while using nodemon, the port seemes to remain open even after quitting causing an EADDRINUSE error.
        * This, according to others, happens due to the nature of nodemon creating child process but failing to remove them after the parent has been killed.
    * use "lsof -i tcp:<x>" where x is the port that you are working with to see if the port is active
    * if active, use "kill -9 <PID-NUMBER>", your application will have a pid number assigned. [PID - process identifier.]
    * upon

___
## TO-DO: 
* make and update a separate log file
* Upload meaningful html files rather than using dummy static files
* learn some more and add functionality.
 