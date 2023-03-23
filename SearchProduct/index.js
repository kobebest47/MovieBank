'use strict';
const 
    config = require('config'),
    express = require('express'),
    mysql = require('mysql');

var app = express();
var port = process.env.PORT || process.env.port || 5006;
app.set('port', port);
app.use(express.json());
app.listen(app.get('port'), function(){
    console.log('[app.listen]Node app is running on port', app.get('port'));
});
module.exports = app;

var config_db = {
    host:'localhost',
    user:config.get("user"),
    password:config.get("password"),
    database:'ec-bot',
    port:3306
};

const conn = new mysql.createConnection(config_db);
conn.connect(function(err){
    if(err){
        console.log("!!! Cannot connect !!! Error");
        throw err;
    }else{
        console.log("Connection established.");
    }
});



app.post('/webhook', function (req, res) {
    console.log("[webhook] in");
    //Dialogflow call here to bring data : Category
    let data = req.body;
    let queryCategory = data.queryResult.parameters["Category"];
    let queryFilter = "";
    if(queryCategory == "熱門"){
        queryFilter = "IsHot = 1";
    }else{
        queryFilter = `Category = '${queryCategory}'`;
    }
    conn.query("SELECT * FROM `product-db` where "+queryFilter, 
    function(err, body, fields){
        if(err) throw err;
        else console.log('Selected '+body.length+' row(s).');
        sendCards(body, res);
    });
});

function sendCards(body, res){
    console.log("[sendCards] in");
    let thisFulfillmentMessages = [];
    for(let x=0; x<body.length; x++){
        let thisObject = {};
        thisObject.card = {};
        thisObject.card.title = body[x].Name;
        thisObject.card.subtitle = body[x].Category;
        thisObject.card.imageUri = body[x].Photo;
        thisObject.card.buttons = [
            {
                text:"看大圖",
                postback: body[x].Photo
            }
        ];
        thisFulfillmentMessages.push(thisObject);
    }
    res.json({fulfillmentMessages:thisFulfillmentMessages});
}