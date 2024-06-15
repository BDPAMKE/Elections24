var express = require('express');
var router = express.Router();
// Normal include statements

const myGetRestCall=require("../middleware/RestAPIGet");
const auth = require("../middleware/verifyToken");
//including middleware

// Generic route to get a list of elections from the beginning (first 100)
router.get('/', auth, function(req,res,next) {
    const url = 'https://elections-irv.api.hscc.bdpa.org/v1/elections';
    const token = process.env.BEARER_TOKEN;
    //console.log(url); //Debug
    
    // Pass url and token into RestAPIGet and pull information from response
    myGetRestCall.getWithBearerToken(url, token)
    .then(data => {
        console.log("REST CALL ", data);
        if (data.success){
            // SUBJECT TO CHANGE
            var electionlist=data.elections;



            res.render('electionlist', { 
                title: 'Elections List' , 
                elections: electionlist
            });
        } // closes if statement
        else{
            res.render('error', {title: 'Election call failed'
            
        });
        }
    }) // data then component
    .catch(error => console.error(error));
}); // close router.get general route

module.exports = router;