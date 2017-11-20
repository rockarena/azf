let urlencode = require('urlencode');
let crypto = require('crypto');
const sortObject = require('sort-object-keys');
// Your Access Key ID, as taken from the Your Account page
const access_key_id = "AKIAI355A6BYD2TOTLAA ";

// Your Secret Key corresponding to the above ID, as taken from the Your Account page
const secret_key = "xOrLX6CdH1Noz7NdXgbzeK/9RXJq+NhiGDaMT/Za";

// The region you are interested in
const endpoint = "webservices.amazon.com";

const uri = "/onca/xml";

function rawurlencode (str) {
    str = (str+'').toString();        
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
                                                                                    replace(/\)/g, '%29').replace(/\*/g, '%2A');
}

function getHash(str){
    return new Buffer(
        crypto.createHmac('SHA256', secret_key ).update(str ,'binary').digest('hex')
    ).toString('base64')
    // var hmac = crypto.createHmac('sha256', secret_key);
    // hmac.update(str).digest('hex'); 
    // return hmac.toString('base64'); 
};

let  params = {
    "Service"       : "AWSECommerceService",
    "Operation"     : "ItemSearch",
    "AWSAccessKeyId": "AKIAI355A6BYD2TOTLAA",
    "AssociateTag"  : "rockarena-20",
    "SearchIndex"   : "All",
    "Keywords"      : "spalding basketball",
    "ResponseGroup" : "Images,ItemAttributes,Offers"
};

// Set current timestamp if not set
if (!(params["Timestamp"])) {
    params["Timestamp"] = (new Date()).toISOString();
}

// Sort the parameters by key
params = sortObject(params);

let pairs = [];

for(let key in params) {
    pairs.push(rawurlencode(key) + "=" + rawurlencode(params[key]));
}

// Generate the canonical query
canonical_query_string = pairs.join("&")

// Generate the string to be signed
string_to_sign = "GET\n" + endpoint + "\n" + uri + "\n" + canonical_query_string;

// Generate the signature required by the Product Advertising API
const signature = new Buffer(getHash(string_to_sign))
// signature = base64.encode(sha256(string_to_sign,secret_key));

// Generate the signed URL
const request_url = 'http://' + endpoint + uri + '?' + canonical_query_string + '&Signature=' + rawurlencode(signature);

module.exports =  {request_url}