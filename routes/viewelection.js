var express = require('express');
var router = express.Router();
// Normal include statements

const myGetRestCall=require("../middleware/RestAPIGet");
const auth = require("../middleware/verifyToken");
//including middleware

// GET route for a specific user (based on username)
router.get('/:election_id', auth, function(req,res,next) {
    //Set up API call
    const url = 'https://elections-irv.api.hscc.bdpa.org/v1/election/' + req.params.election_id;
    const token = process.env.BEARER_TOKEN;
    // Pass url and token into RestAPIGet and pull information from response
    myGetRestCall.getWithBearerToken(url, token)
    .then(data => {
    console.log('REST CALL',data);
    if (data.success){

        res.render('electionlist',{title:'Election Call Successful'});


    } // closes if statement
    else{
        res.render('error', {title: 'User call failed'
    });
    }


}) // data then component
.catch(error => console.error(error));


});

module.exports = router;