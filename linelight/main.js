$(function(){
    setInterval(update, 1000);
});

function update(){
    let url="http://localhost:3000/devices/1";
    let data = $.getJSON(url)
    .done(function(msg){
        console.log(msg);
        $("h1").text(`電燈狀態:${msg.lightSwitch}`);
        if(msg.lightSwitch == '開'){
            $('img').attr("src", "images/on.png");
            
        }else{
            $('img').attr("src", "images/off.jpg");
        }

    })
    .fail(function(msg){
        console.log("fail");
    })
    .always(function(msg){
        console.log("Good");
    });
}