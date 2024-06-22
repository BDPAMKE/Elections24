
//MODIFY RENDER STATEMENTS TO INCORPORATE AUTH TOKEN INFO!! 4/6/24

//DID I GET A SET OF USERINDICES AND MONGOIDS INTO A MONGODB???

var express = require('express');
var router = express.Router();
// Normal include statements

const myGetRestCall=require("../middleware/RestAPIGet");
//const myIncrementRestCall = require("../middleware/RestAPIIncrement");
const auth = require("../middleware/verifyToken");
//including middleware
//var store = require('store');

// Generic route to get a list of users from the beginning (first 100)
router.get('/', auth, function(req,res,next) {
    const url = 'https://elections-cpl.api.hscc.bdpa.org/v1/info'
    const token = process.env.BEARER_TOKEN;
    //console.log(url); //Debug
  
    
    // Pass url and token into RestAPIGet and pull information from response
    myGetRestCall.getWithBearerToken(url, token)
    .then(data => {
        console.log("REST CALL ", data);
        if (data.success){
            // SUBJECT TO CHANGE
            var electionInfo=data.info;

            
              
            // Get the count of the number of users from store
            // var userCount= store.get('users').count;

            res.render('index', { 
                title: 'Elections 2024',
               upcomingElections: electionInfo.upcomingElections,
               openElections: electionInfo.openElections,
               closedElections: electionInfo.closedElections
                
            });
        } // closes if statement
        else{
            res.render('error', {title: 'Stats call failed', 
            message: data.error,
            id: res.locals.user_id,
            role: res.locals.role,
            name: res.locals.name
        });
        }
    }) // data then component
    .catch(error => console.error(error));
}); // close router.get general route






module.exports=router;
    