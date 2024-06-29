var express = require('express');
var router = express.Router();
// Normal include statements

const myGetRestCall=require("../middleware/RestAPIGet");
const auth = require("../middleware/verifyToken");

router.get('/', auth, function(req,res,next) {
    if ((res.locals.role) && ((res.locals.role == 'admin') || (res.locals.role == 'super'))) {
        //console.log(res.locals.role,":register page")
        res.render('register', { title: 'Elections User Registration' })
    }
    else {
        res.redirect('dashboard');
    }
});

router.post('/', auth, async(req,res,next) => {
    const captchaAnswer = req.body.captchaAnswer;
    const correctCaptcha = req.body.correctCaptcha;
    if (parseInt(captchaAnswer) !== parseInt(correctCaptcha)) {
        return res.status(400).send('Incorrect CAPTCHA answer.');
    }

    if ((res.locals.role) && ((res.locals.role == 'admin') || (res.locals.role == 'super'))) {
        //console.log(req.body.uname);
        //console.log(req.body.userlevel);


        

        // Encryption attempt...
        const KEY_SIZE_BYTES = 64;
        // The API expects a 16 byte salt (32 hex digits long):
        const SALT_SIZE_BYTES = 16;

        // A function that converts a ByteArray or any other array of bytes into a
            // string of hexadecimal digits
            const convertBufferToHex = (buffer) => {
            return (
                // This next line ensures we're dealing with an actual array
                [...new Uint8Array(buffer)]
                // Keep in mind that:
                // 1 byte = 8 bits
                // 1 hex digit = 4 bits
                // 1 byte = 2 hex digits
                // So, convert each 1 byte into 2 hexadecimal digits
                .map((byte) => byte.toString(16).padStart(2, '0'))
                 // Concatenate it all together into one big string
                 .join('')
            );
            };

            // A function that converts a string of hexadecimal digits into an array of
            // bytes (you should verify that the string is hex first!)
            const convertHexToBuffer = (hexString) => {
            return Uint8Array.from(
                // Keep in mind that:
                // 1 byte = 8 bits
                // 1 hex digit = 4 bits
                // 1 byte = 2 hex digits
                // So, convert every pair of hexadecimal digits into 1 byte
                hexString.match(/[0-9a-f]{1,2}/gi).map((byte) => parseInt(byte, 16))
            );
            };

            // Turns a password (string) and salt (buffer) into a key and salt (hex strings)
            const deriveKeyFromPassword = async (passwordString, body, saltBuffer) => {
            // We'll use a TextEncoder to convert strings into arrays of bytes:
            const textEncoder = new TextEncoder('utf-8');

            // Convert the password string into an array of bytes:
            const passwordBuffer = textEncoder.encode(passwordString);

             // Use WebCrypto to generate an array of 16 random bytes if one isn't passed
            // in:
            saltBuffer =
                saltBuffer ||
                crypto.getRandomValues(new Uint8Array(SALT_SIZE_BYTES));

            console.log("SaltBuffer:",saltBuffer);
            // Convert our passwordBuffer into something WebCrypto understands:
            const plaintextKey = await crypto.subtle.importKey(
                'raw', // We're working with a "raw" array of bytes
                passwordBuffer, // Pass in our (converted) password byte array
                'PBKDF2', // Tell WebCrypto our byte array doesn't contain anything fancy
                false, // We don't want anyone to extract the original password!
                ['deriveBits'] // We're gonna use this method to derive a key (below)
            );

            //console.log("PTKey",plaintextKey);
            // Run the WebCrypto-compatible password through the PBKDF2 algorithm:
            const pbkdf2Buffer = await crypto.subtle.deriveBits(
                {
                // We want to use PBKDF#2 to "hash" our user's password
                name: 'PBKDF2',
                // Let's use that array of 16 random bytes we made earlier
                salt: saltBuffer,
                // Higher the number, the longer it takes, but the more secure it is!
                // 100,000 is pretty good. More than 500,000 might be slow on mobile.
                //
                // NOTICE: all teams should use 100,000 iterations for PBKDF2 to make cross-app
                // logins easier for the judges!
                iterations: 100000,
                // This should look familiar...
                hash: 'SHA-256'
                },
                // Pass in the user's password (which has been converted)
                plaintextKey,
                // Let's derive a 128 byte key. Since we're using a function called
                // deriveBITS, and 8 BITS = 1 byte, and we want 128 bytes, we need this
                // function to spit out 128 * 8 bits!
                KEY_SIZE_BYTES * 8
            );

            // At this point, derivedKey contains an array of 128 bytes. We got
            // these bytes by running the user's password + a salt (16 random
            // characters) through the PBKDF#2 function. All that's left to do is
            // convert our byte arrays into (hex) strings and send them to the API.

            // Since the API expects the salt and the key to be in hexadecimal,
            // we'll need to turn our byte arrays into hex strings:
            const saltString = convertBufferToHex(saltBuffer);
            const keyString = convertBufferToHex(pbkdf2Buffer);
            console.log("Salt=",saltString);
            console.log("Key=",keyString);
            return { keyString, saltString };
        };

        const { keyString, saltString } = await deriveKeyFromPassword(req.body.pwd, req.body);
        username=req.body.uname;
        email=req.body.email;

        // Check to see if username or email is in MongoDB
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
            const collection = db.collection('Users');
            //Find after id for API call using mongo
            const queryname={"username":username};
            console.log(queryname);
            const object1=await collection.findOne(queryname);
            const queryemail={"email":email};
            //console.log(queryemail);
            const object2=await collection.findOne(queryemail);
            //console.log(object);
            if ((object1!=null)||(object2!=null)) {
                res.render('register', { title: 'Registration Failed-User Exists' });
            }
            else{
                collection.insertOne({
                    username:username,
                    role:req.body.userlevel,
                    email:email,
                    city:req.body.city,
                    state:req.body.state,
                    zip:req.body.zip,
                    address:req.body.addr,
                    deleted:false,
                    key:keyString,
                    salt:saltString,
                    lastIP:"",
                    lastLoginTime:"",
                    pwdupdated:false
                });
                res.render('register', { title: 'Registration Successful' });
            }
        }
        finally {
            // Ensures that the client will close when you finish/error
        //await client.close();
        }

        }  
        run().catch(console.dir);


        //res.render('register', { title: 'Data Submitted' });




    }
    else {
        res.redirect('dashboard');
    }
});

module.exports = router;
