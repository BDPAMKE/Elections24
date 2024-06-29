var express = require('express');
var router = express.Router();
// Normal include statements

const myGetRestCall=require("../middleware/RestAPIGet");
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

module.exports = router;