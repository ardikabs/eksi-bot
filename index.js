

// EXAMPLE COMMON JS USING LINEBOT SDK

var express = require("express");
var linebot = require("linebot");

const app = express();

const bot = linebot({
    channelId: "1531000409",
    channelAccessToken: "Gk1U5+5F55Mlr6G4VCwX99U5qrRf05n93VMMG/rLqMu1zIR3zp2sqc5wUmsBczkDG2QIwe/r1a1aTxWvzFEkhO1/YQepMzugpv+NRbhaqJhQkkfv8CQ4oi7iddjReaTsS1Vr0gR9+o5anP1Q2kU7ygdB04t89/1O/w1cDnyilFU=",
    channelSecret: "5f49cb56ac5d55fc61d0981fa8bdf49b",
    verify: true
});

const linebotparser = bot.parser();
app.post('/linewebhook',linebotparser);

bot.on("message",(event)=>{
    let type = event.message.type;
    if(type == "location"){
        event.reply("Alamat :"+event.message.address)
            .then((data)=>{
                console.log("Success :",data);
            })
            .catch((error)=>{
                console.log("Error :",error);
            });
    }

    else if(type == "text"){
        let validate = validateInput(event.message.text);
        let input = splitInput(event.message.text,7);
        let output = "Ini inputmu yah : "+input;
    
        if(validate == "@kania"){
            event.reply(output)
                .then((data)=>{
                    console.log("Success :",data);
                })
                .catch((error)=>{
                    console.log("Error :",error);
                });
        }
        else{
            let sorryMsg = "Maaf ya aku gatau kamu ngomongin apa :(";
            event.reply(sorryMsg)
                .then((data)=>{
                    console.log("Success :",data);
                })
                .catch((error)=>{
                    console.log("Error :",error);
                });
        }
    }

    else if(type == "image"){
        event.reply("Ih gambar apa tuh :o")
            .then((data)=>{
                console.log("Success :",data);
            })
            .catch((error)=>{
                console.log("Error :",error);
            });
    }

});

bot.on('follow', (event)=>{
    let greetingMessage = [
        "Terima kasih telah menambahkan aku menjadi temanmu !",
        "Gunakan perintah /help untuk mengetahui aku lebih lanjut",
        "Untuk memulai percakapan denganku panggil @kania ya !"
    ] 
    event.reply(greetingMessage)
        .then((data)=>{
            console.log("Success :",data);
        })
        .catch((error)=>{
            console.log("Error :",error);
        });
});

bot.on('unfollow', (event)=>{ 

});

bot.on('join', (event)=>{ 

});

bot.on('leave', (event)=>{ 

});

bot.on('postback', (event)=>{ 

});

bot.on('beacon', (event)=>{ 

});

function validateInput(val){
    return val.substring(0,6);
}

function splitInput(val,index){
    return val.substring(index);
}

app.listen(process.env.PORT || 3000, () => {
	console.log('LineBot is running.');
});