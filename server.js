require('dotenv').config();
const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
const app = express();
const dns = require('dns');

require('dotenv').config();
mongodb = require('mongodb');
mongoose = require('mongoose');

// DB Configuration
mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// DB Schema
const UrlSchema = new mongoose.Schema({
  url: {type: String, required: true},
  short: Number
});

const Url = mongoose.model('Url', UrlSchema);

app.post('/api/shorturl', (req, res) => {
  let inputUrl = req.body.url;

  // dns.lookup(inputUrl, (err, address, family) => {
  //   if(err){
  //     res.json({
  //       "error" : "invalid url"
  //     });
  //     return 
  //   }
  // });
  
  let urlRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);

  if(!inputUrl.match(urlRegex)){
    res.json({
      "error" : "invalid url"
    });
    return
  }

  let inputShort = 1;

  Url.findOne({})
    .sort({short: 'desc'})
    .exec((error, result) => {
      if(!error){
        if(result){
          inputShort = result.short + 1;
        }
        
        Url.findOneAndUpdate(
          {url: inputUrl},
          {url: inputUrl, short: inputShort},
          {new: true, upsert: true},
          (error, savedUrl) => {
            res.json({
              "original_url": inputUrl,
              "short_url": savedUrl.short
            });
          }
        );
      }
      
    });
});

app.get('/api/shorturl/:short', (req,res) => {
  let shortUrl = req.params.short;

   Url.findOne({short: shortUrl}, function(error, data) {
    if(error) res.json({'error' : 'invalid url'});
    res.redirect(data.url);
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});





