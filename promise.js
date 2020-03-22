let p1 = new Promise(function(req, res){
    setTimeout(() => {
        console.log("its a good day to express.");
    }, 5000);
});

console.log("The next sentence is fake news.");