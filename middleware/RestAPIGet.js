const https=require('https');

module.exports = {
    getWithBearerToken: function(url, token) {
        const options = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }; // completes our options definition
        console.log(options);
        return new Promise((resolve, reject) => {
            const req=https.get(url, options, res => {
                let data = '';
                res.on('data', chunk  => {
                    data += chunk;
                }); //end res.on with data
                res.on('end', () => {
                    resolve(JSON.parse(data));
                }); //end res.on with end
            }); //close the req definition

            req.on('error', error => {
                reject(error);
            }); //close the req.on error

            req.end();

        }); //close the new Promise
    } //close function definition
} //close module.exports






