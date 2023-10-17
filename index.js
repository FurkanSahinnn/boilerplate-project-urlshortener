require('dotenv').config();
const express = require('express');
const shortId = require('shortid');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({
  extended:true
}));


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


// you will use a URL encoded body.
// To parse the data coming from POST requests, you must use the body-parser package. 
// This package allows you to use a series of middleware, which can decode data in different formats.
// You can access elements using req.body

// url = "https://freeCodeCamp.org"
// short_url = 1

let urlDatabase = []
let shortUrlDatabase = []

app.post("/api/shorturl", bodyParser.urlencoded({extended : false}),
  (req, res) => {
    let original_url_str = req.body.url
    let original_url = new URL(req.body.url)

    let protocolOriginal = original_url.protocol

    if (protocolOriginal != "https:" && protocolOriginal != "http:") {
      return res.json({error : "invalid url"});
    }

    let short_url = shortId.generate(original_url_str)

    urlDatabase.push(original_url_str)
    shortUrlDatabase.push(short_url)

    return res.json({original_url : original_url_str, short_url : short_url})
  }
);

app.get("/api/shorturl/:shortUrl", (req, res) => {
  let short_url = req.params.shortUrl;
  let indexOriginalUrl = shortUrlDatabase.indexOf(short_url)

  return res.redirect(urlDatabase.at(indexOriginalUrl));
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
