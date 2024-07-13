var express = require('express');
var router = express.Router();
// Normal include statements

const myGetRestCall=require("../middleware/RestAPIGet");
const myPutRestCall=require("../middleware/RestAPIPut");
const auth = require("../middleware/verifyToken");
//including middleware

// Generic route to get a list of elections that the user can vote in.
router.get('/', auth, function(req,res,next) {
    const name=res.locals.name;
    var electionlist=[];

    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = "mongodb+srv://" + process.env.MONGO_LOGIN + "@inbdpa23.dmklbqg.mongodb.net/?retryWrites=true&w=majority&appName=inBDPA23";
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
        serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        }
    });
    async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        console.log("Attempting to ping deployment");
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        const db = client.db('Elections24');
        const collection = db.collection('ElectionVoters');
        //Find after id for API call using mongo
        var query={votersassigned: {$in: [name]}};
        console.log(query);
        const object=await collection.find(query).toArray();
        console.log(object);
        electionlist=object;
        res.render('voteelectionlist',{ 
            title: 'You may vote in the following elections' , 
            elections: electionlist
        });
    }
        finally {
        // Ensures that the client will close when you finish/error
            await client.close();
        }

    }  
    run().catch(console.dir);

    console.log("ELECTION LIST")
    console.log(electionlist)
    // res.render('voteelectionlist',{ 
    //     title: 'You may vote in the following elections' , 
    //     elections: electionlist
    // });

}); // close router.get general route

//Specific route to a specific ballot
router.get('/:election_id', auth, function(req,res,next) {
    const url = 'https://elections-cpl.api.hscc.bdpa.org/v1/elections/' + req.params.election_id
    const token = process.env.BEARER_TOKEN;
    //console.log(url);

    myGetRestCall.getWithBearerToken(url, token)
    .then(data => {
    //console.log('REST CALL',data);
    if (data.success){
        electioninfo=data.election; 
        //INSERT res.render statement to view the ballot casting page
        res.render('voteelectionballot', {title: 'Cast ballot', electioninfo: electioninfo})
        }
    else{
        res.render('error', {title: 'Unable to get election info'
    });
    }


}) // data then component
.catch(error => console.error(error));

});    


//Route to post a vote
router.post('/:election_id', auth, function(req,res,next) {
    const name=res.locals.name;
    console.log(req.body);
    var keys=Object.keys(req.body)
    var ranking={}
    for (var key in keys){
        //console.log(keys[key]);
        //console.log(req.body[keys[key]]);
        var choice=req.body[keys[key]];
        ranking[choice]=(Number(key)+1)
    }
    console.log(ranking);
    const url = 'https://elections-cpl.api.hscc.bdpa.org/v1/elections/' + req.params.election_id +'/ballots/' +name;
    const token = process.env.BEARER_TOKEN;
    const body={"ranking":ranking}
    myPutRestCall.putWithBearerToken(url, token, body);
    res.redirect('/voteelection/'+req.params.election_id);
});

module.exports = router;