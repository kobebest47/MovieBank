'use strict';
const
    config = require('config'),
    express = require('express'),
    axios = require('axios');

var app = express();
var port = process.env.PORT || process.env.port || 5005;
app.set('port', port);
app.use(express.json());
app.listen(app.get('port'), function () {
    console.log('[app.listen]Node app is running on port', app.get('port'));
});

module.exports = app;

app.post('/webhook', function (req, res) {
    console.log("[webhook] in");
    //Dialogflow call here to bring data : Category
    let data = req.body;
    let lightStatus = data.queryResult.parameters["lightstatus"];
    let password = data.queryResult.parameters["Password"];
    if(password == config.get("Password")){
        let updateData = {
            id:1,
            lightName:"main",
            lightSwitch:lightStatus
        };
        let axios_update_data = {
            method:"put",
            url:"http://localhost:3000/devices/1",
            headers:{
                "content-type":"application/json"
            },
            data:updateData
        };
        axios(axios_update_data)
        .then(function(response){
            console.log(JSON.stringify(response.data));
            res.json({fulfillmentText:"更新完成"})
        })
        .catch(function(error){
            console.log(error);
        })
    }else{
        res.json({fulfillmentText:"密碼錯誤"})
    }
});

