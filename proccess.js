var http = require('http');
const async = require('async');
const request = require('request');
const cheerio = require('cheerio')

function prepareUrls(data){
    return data.map(function(item,i){
        // if (!i) 
        // console.log(JSON.stringify(item));
        return item.ItemLinks[0].ItemLink.filter(function(link){
                return link.Description[0] == "All Customer Reviews"
            })[0].URL[0];
        })
}


function getAmazonReviews(urls, data, proccessReviews, toBrowser) {

    function httpGet(url, callback) {
      const options = {
        url :  url,
        json : true
      };
      request(options,
        function(err, res, body) {
          callback(err, body);
        }
      );
    }
    
     async.map(urls, httpGet, function (err, res){
      if (err) return console.log(err);
      //console.log(res);
      data.forEach(function(item, index) {
        item.ItemLinks[0].ItemLink.push({reviews: getReviews(res[index])})
      });
      proccessReviews(data, toBrowser)
    });
}

function getReviews(html){

    const $ = cheerio.load(html);
    let reviews = [];
    $('div[id^="customer_review"]').each(function(element) {
        let stars = $(this).find('.a-icon-alt').text();
        let title = $(this).find('a[data-hook^="review-title"]').text();
        let author = $(this).find('a[data-hook^="review-author"]').text();
        let date = $(this).find('span[data-hook^="review-date"]').text();
        let helpfull = $(this).find('span[data-hook^="helpful-vote-statement"]').text();
        let review = $(this).find('span[data-hook^="review-body"]').text();
        reviews.push({
            stars,
            title,
            author,
            date,
            helpfull,
            review
        });
    });
    // $('span[data-hook^="review-body"]').each(function(element) {
    //     reviews.push($(this).text());
    // });

    return reviews
    
}

function proccessReviews(res,toBrowser){
    return toBrowser(res)
}

exports.getReviews = function(data, toBrowser){
    getAmazonReviews(prepareUrls(data), data,proccessReviews, toBrowser)
}