var express = require('express');
var router = express.Router();
// Normal include statements

const myGetRestCall=require("../middleware/RestAPIGet");
const auth = require("../middleware/verifyToken");
const countBallots=require("../middleware/countBallots");
//including middleware

// GET route for a specific user (based on username)
router.get('/:election_id', auth, function(req,res,next) {
    //Set up API call
    const url = 'https://elections-cpl.api.hscc.bdpa.org/v1/elections/' + req.params.election_id;
    const token = process.env.BEARER_TOKEN;
    // Pass url and token into RestAPIGet and pull information from response
    myGetRestCall.getWithBearerToken(url, token)
    .then(data => {
    console.log('REST CALL',data);
    if (data.success){
        electioninfo=data.election;
        const balloturl='https://elections-cpl.api.hscc.bdpa.org/v1/elections/' + req.params.election_id + '/ballots';

        myGetRestCall.getWithBearerToken(balloturl,token)
        .then(data => {
            console.log('BALLOT CALL', data);
            if (data.success){
                ballotinfo=data.ballots;
                countBallots.GetBallotPreferenceCount(electioninfo.options,ballotinfo);
                res.render('viewelection',{title:'Election Call Successful',electioninfo:electioninfo,ballots:ballotinfo});
            }
            else{
                res.render('error', {title: 'Ballot call failed'
                });
            }
        })
        
        .catch(error => console.error(error));


    } // closes if statement
    else{
        res.render('error', {title: 'Unable to get election info'
    });
    }


}) // data then component
.catch(error => console.error(error));


});

module.exports = router;