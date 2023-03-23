'use strict';
const 
    config = require('config'),
    express = require('express'),
    request = require('request');

var app = express();
var port = process.env.PORT || process.env.port || 5005;
app.set('port', port);
app.use(express.json());
app.listen(app.get('port'), function(){
    console.log('[app.listen]Node app is running on port', app.get('port'));
});

module.exports = app;

const MOVIE_API_KEY = config.get('MovieDB_API_Key');

app.post('/webhook',function(req, res){
    console.log("[webhook] in");
    //Dialogflow call here to bring data : movie name
    let data = req.body;
    let queryMovieName = data.queryResult.parameters.MovieName;
    //Request TMDB
    let propertiesObject = {
        query:queryMovieName,
        api_key:MOVIE_API_KEY,
        language:'zh-TW'
    };
    request({
        uri:"https://api.themoviedb.org/3/search/movie?",
        json:true,
        qs:propertiesObject
    }, function(error, response, body){
        if(!error && response.statusCode == 200){
            if(body.results.length!=0){
                let thisFulfillmentMessages = [];
                let movieTitleObject = {};
                // Title
                if(body.results[0].title == queryMovieName){
                    //perfect match
                    movieTitleObject.text = {text:[body.results[0].title]};
                }else{
                    movieTitleObject.text = {text: ["系統內最相關的電影是"+body.results[0].title]};
                }
                thisFulfillmentMessages.push(movieTitleObject);
                //Overview
                if(body.results[0].overview){
                    let movieOverViewObject = {};
                    movieOverViewObject.text = { text: [body.results[0].overview]};
                    thisFulfillmentMessages.push(movieOverViewObject);
                }
                //Poster
                if(body.results[0].poster_path){
                    let movieImageObject = {};
                    movieImageObject.image = { imageUri: "https://image.tmdb.org/t/p/original" + body.results[0].poster_path };
                    thisFulfillmentMessages.push(movieImageObject);
                }
                res.json({fulfillmentMessages:thisFulfillmentMessages});
            }else{
                res.json({fulfillmentText:"很抱歉，系統裡面沒有這部電影"});
            }
        }else{
            console.log("[The MovieDB] Failed");
        }
    });
});