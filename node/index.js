const express = require('express')
const request = require('request');
const cors = require('cors');
const fs = require('fs'); 
const mongoose = require('mongoose');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://sahilnare78:e6u8jiq9yDNpSMoN@holapeeps.k6ab3.mongodb.net/farmhelper?retryWrites=true&w=majority";

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
    
});

app.post('/disease', upload.single('imageFile'), function(req, res) {

    const flaskReq = request.post('http://127.0.0.1:5000/predict', function (err, resp, body) {
        if (err) {
          console.log('Error!');
          console.log(err);
        } else {
          console.log('Disease prediction: ' + body);
          res.send(body);
        }
      });
      const form = flaskReq.form();
      form.append('file', fs.createReadStream(__dirname + '/' + req.file.path), {
        filename: 'imageFile.jpg',
        contentType: 'image/jpeg'
      });

});

app.post('/weeklyheight', upload.single('imageFile'), function(req, res) {

    const flaskReq = request.post('http://127.0.0.1:5000/height', function (err, resp, body) {
        if (err) {
          console.log('Error!');
          console.log(err);
        } else {
          console.log('Height: ' + body);
          const newBody = JSON.parse(body);
          res.json({height: newBody.height, imagePath: path.resolve(__dirname + '/' + req.file.path)});
        }
      });
      const form = flaskReq.form();
      form.append('file', fs.createReadStream(__dirname + '/' + req.file.path), {
        filename: 'imageFile.jpg',
        contentType: 'image/jpeg'
      });

});

app.post('/pricepredict', function(req, res) {

    console.log(req.body);

    var options = { 
        method: 'POST', 
        uri: 'http://127.0.0.1:5000/price', 
        body: req.body.cropData, 
        json: true // Automatically stringifies the body to JSON 
    }; 
     
    // var returndata = "done"; 
    var sendrequest = request(options, function(error, response, body) {
        // console.log(response);
        console.log(body);
        res.send(body); 
    });
    
});

// Routes
const userAuthRouter = require('./routes/userAuth.js');
const weeklyRouter = require('./routes/weeklyCrop.js');
const path = require('path');
app.use('/api/auth', userAuthRouter);
app.use('/api/weekly', weeklyRouter);

// MongoDB and server setup
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("MongoDB database connection established successfully!");
    app.listen(PORT, function (){ 
        console.log('Listening on Port 3001');
    });
  }).catch(err => console.log(err));


