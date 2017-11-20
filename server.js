var express = require('express')
var request = require('request');

var urls = require('./proccess.js');
var app = express()
const url = require('./get')

const access_key_id = "AKIAI355A6BYD2TOTLAA";

const secret_key = "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";
var amazon = require('amazon-product-api');

let client = amazon.createClient({
    awsId: access_key_id,
    awsSecret: secret_key,
    awsTag: "rockarena-20"
  });

app.use(express.static('./client/'))

app.get('/amz', function(req, res) {
    console.log(req)
    if (req.query.search){
    client.itemSearch({
        // director: 'Quentin Tarantino',
        // actor: 'Samuel L. Jackson',
        // searchIndex: 'DVD',
        // audienceRating: 'R',
        // &pageSize=1278
        // "sort":reviewrank, //reviewscore
        // reviewrank_authority // Review rank: high to low // -reviewrank_authority
        "-unit-sales":true,
        "responseGroup": 'ItemAttributes,Offers,Images',
        "keywords": req.query.search,
        "IncludeReviewsSummary":"true"
      }, function(err, results, response) {
        if (err) {
          console.log(err);
        } else {
        //   console.log(results);  // products (Array of Object)
          urls.getReviews(results, toBrowser(res))
          //   res.json(results);
        //   console.log(response); // response (Array where the first element is an Object that contains Request, Item, etc.)
        }
      });
    }


})

function toBrowser(res){
    return function(data){
        
        
        res.json(data)
    }
}

app.get('/', function(req, res) {
    res.send('./client/index.html');
});


app.listen(7000)
