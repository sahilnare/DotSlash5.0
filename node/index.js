const express = require('express')
const request = require('request');
const cors = require('cors')

app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json())

app.get('/home', function(req, res) {
    request('http://127.0.0.1:5000/flask', function (error, response, body) {
        console.error('error:', error); // Print the error
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the data received
        res.send(body); //Display the response on the website
      });      
});

app.post('/crops', function(req, res) {

    console.log(req.body);

    var options = { 
        method: 'POST', 
        uri: 'http://127.0.0.1:5000/recommend', 
        body: req.body.cropData, 
        json: true // Automatically stringifies the body to JSON 
    }; 
     
    // var returndata = "done"; 
    var sendrequest = request(options, function(error, response, body) {
        // console.log(response);
        console.log(body);
        res.send(body); 
    });

    // .then(function (parsedBody) { 
    //     console.log(parsedBody); // parsedBody contains the data sent back from the Flask server 
    //     returndata = parsedBody; // do something with this data, here I'm assigning it to a variable. 
    // }) 
    // .catch(function (err) { 
    //     console.log(err); 
    // }); 
     
    
});

app.listen(PORT, function (){ 
    console.log('Listening on Port 3001');
});
