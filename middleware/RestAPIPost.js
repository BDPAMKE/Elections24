const https = require('https');
module.exports = {
     postWithBearerToken:  function  (url, token, body) {     //We also need to pass body value as a parameter along with url and token
      fetch(url, {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
}) 
.then(response => response.json())
.then(data =>  { console.log("post",data)
               return data})

.catch(error => console.error(error))
    }
    };