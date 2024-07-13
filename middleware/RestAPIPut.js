const https = require('https');
module.exports = {
     putWithBearerToken:  function  (url, token, body) {     //We also need to pass body value as a parameter along with url and token
      fetch(url, {
  method: 'PUT',
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
}) 
.then(response => response.json())
.then(data =>  { console.log("put",data)
               return data})

.catch(error => console.error(error))
    }
    };