import * as linebot from 'linebot';
import * as fetch from 'node-fetch';
import config from "../../config/main";
import admin from "../../config/admin";

declare const Promise: any;

class Messages{

    public token:string;
    public headers: {};
    public db;
    
    constructor(public event:any,public bot?:linebot){
        this.token = event.replyToken;
        this.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        };
        this.db = admin.database();
       
        // Webhook handler
        let type = event.message.type;
        if(type == "text"){
            if(event.source.type == "user"){
                this.userMsg();                
            }
            else if(event.source.type == "group"){
                this.groupMsg();
            }
        }
        else if(type == "image"){
            this.imageMsg();
        }
        else{
            let sorryMsg = [
                "Maaf ya, aku masih belum paham :(",
                "Kalau masih bingung sama Eksi, gunakan perintah @help aja :)"
            ];
            this.reply(sorryMsg);
        }
    }

    public userMsg(){
        let userId = this.event.source.userId;        
        let textInput = this.event.message.text;
        let _valid = validate(textInput);
        let understand = _valid[0];
        let replyMsg;
        let provider = {
            jne:"JNE",
            sicepat:"SiCepat",
            wahana:"Wahana"
        }

        if(understand){
            let check = textInput.split(' ').join('');
            if(check == _valid[1]){
                replyMsg = [
                    'Tambahkan informasi no resi kamu supaya Eksi bisa mengetahui informasinya.',
                    'Contoh : @{nama-layanan} {no-resi} \n@jne CGK7K02103326517 \n@sicepat 00005366108 \n@wahana ADG66845',
                    'Pastikan bahwa no resi kamu adalah salah satu dari layanan JNE, Wahana, atau SiCepat'
                ];
                this.event.reply(replyMsg)
                    .then((data)=>{
                        console.log("Success Reply:",data);
                    })
                    .catch((error)=>{
                        console.log("Error Reply:",error);
                    });
            }
            else if(_valid[1] == "@subscribe"){
                let _resi = splitInput(textInput,_valid[2]);

                let resiRef = this.db.ref("history").child(userId).child(_resi);
                let subsRef = this.db.ref("subscribe").child(userId);

                resiRef.once("value",(snapshot)=>{
                    if(snapshot.exists()){
                        let data = snapshot.val();
                        // Set Subscribe Node Value
                        subsRef.child(_resi).set(true);
                        
                        // Reply Message
                        replyMsg = [
                            "Kamu telah mensubscribe resi untuk layanan "+provider[data.provider]+" - "+_resi,
                            "Kami akan segera memberikan notifikasi apabila terdapat informasi terbaru pada resi tersebut.",
                            "Informasi terbaru dapat didapatkan antara pukul 10.00, 16.00, dan 21.00 WIB. Terima kasih !"
                        ];
                        this.reply(replyMsg);
                    }
                    else{                       
                        replyMsg = [
                            "Hei! Untuk menggunakan layanan subscribe, cek dulu dong dengan Eksi",
                            "Kalau kamu belum tau gimana cara pakai Eksi, gunakan perintah @help yah. Terima Kasih"];

                        this.reply(replyMsg);
                    }
                });           
                
            }
            else if(_valid[1] == "@done"){
                let _resi = splitInput(textInput,_valid[2]);
                let resiRef = this.db.ref("history").child(userId).child(_resi);
                let subsRef = this.db.ref("subscribe").child(userId);

                resiRef.once("value",(snapshot)=>{
                    if(snapshot.exists()){
                        let data = snapshot.val();
                        resiRef.update({
                            done:true
                        });
    
                        subsRef.child(_resi).remove();
                    }
                    else{
                        replyMsg = [
                            "Hei Kamu Lupa ya! Untuk menggunakan layanan ini, kamu harus cek dulu dengan perintah @{layanan} {no-resi}",
                            "Kalau kamu belum tau gimana cara pakai Eksi, gunakan perintah @help yah. Terima Kasih"];

                        this.reply(replyMsg);
                    }
                });

                replyMsg = [
                    "Okay, layanan subscribe untuk resi ["+_resi+"] telah dihentikan.\nSemoga harimu menyenangkan !"
                ];
                this.reply(replyMsg);
            }
            else{
                let _keyprovider = _valid[1].split('@')[1];
                let _resi = splitInput(textInput,_valid[2]);

                let params = "?jasa="+_keyprovider+"&resi="+_resi;

                this.get(config.URL_API+params)
                    .then((res)=>{
                        Promise.resolve(res.json())
                            .then((val) =>{

                                replyMsg = [
                                    "Informasi Resi "+ provider[_keyprovider] +" - "+_resi+"\n==========================\nNama Pengirim : "+ val.gen_info.shipper+"\nKota Pengirim : "+ val.gen_info.shipper_city+"\nTanggal Pengiriman : "+ val.gen_info.date+"\n\==========================\nNama Penerima : "+ val.gen_info.receiver +"\nKota Penerima : "+ val.gen_info.receiver_city+"\nAlamat Penerima : "+ val.gen_info.receiver_address+"\n",
                                    "INFORMASI HISTORY PENGIRIMAN (5 terakhir)"
                                ];
                                let manifest = [];
                                
                                for(let i=0; i<val.manifest.length; i++){
                                    manifest.push(
                                        "Tanggal : "+ val.manifest[i].manifest_date+"\nKeterangan : "+ val.manifest[i].manifest_desc);
                                }

                                this.event.reply(replyMsg)
                                    .then((data)=>{
                                        console.log("Success Reply:"+data);

                                        let _dataLength = manifest.length;
                                        if(_dataLength < 5){
                                            replyMsg = manifest;                                            
                                            this.push(userId,replyMsg);
                                        }
                                        else{
                                            replyMsg = new Array();
                                            for(let i=_dataLength-5;i<_dataLength;i++){
                                                replyMsg.push(manifest[i]);
                                            }
                                            this.push(userId,replyMsg);
                                        }


                                        let db = admin.database();
                                        let resiRef = db.ref("history").child(userId).child(_resi);
                                        resiRef.once("value",(data)=>{
                                                if(!data.exists()){
                                                    resiRef.set({
                                                        provider:_keyprovider,
                                                        lastManifest:manifest.length,
                                                        requestAt:admin.database.ServerValue.TIMESTAMP,
                                                        done:false
                                                    });
                                                }
                                                else{
                                                    resiRef.update({
                                                        lastManifest:manifest.length,
                                                    });
                                                }
                                            })
                                            .then(()=>{
                                                replyMsg = [
                                                    "Hei! Kamu dapat memantau no resi ["+_resi+"] secara otomatis loh\nMau coba nggak? Ikutin aja perintah berikut ini: @subscribe {no-resi}",
                                                    "Kita akan kasih tau kamu apabila ada informasi terbaru terkait no resi kamu loh, informasi tersebut akan diperbarui setiap pukul 10.00, 16.00, 21.00 WIB. Terima kasih"
                                                ];
                                                this.push(userId,replyMsg);
                                            });
                                        

                                    })
                                    .catch((err)=>{
                                        console.log("Error Reply:"+err);
                                    });

                            })                            
                            .catch((err)=>{
                                console.log("Error Promise:"+err);
                                replyMsg = [
                                    "Maaf ya, no resi yang kamu masukkan tidak teridentifikasi atau kamu bisa coba lagi deh",
                                    "Jika no resi masih baru, tunggu sekitar 1x24 jam agar dapat terdeteksi",
                                    "Pastikan sesuai dengan formatnya @{nama-layanan} {no-resi}",
                                ];
                                this.reply(replyMsg);

                            });
                            
                    })
                    .catch((err)=>{
                        console.log("Error Request:"+err);
                        let failedMsg = [
                            "Maaf ya, no resi yang kamu masukkan tidak teridentifikasi atau kamu bisa coba lagi deh",
                            "Jika no resi masih baru, tunggu sekitar 1x24 jam agar dapat terdeteksi",
                            "Pastikan sesuai dengan formatnya @{nama-layanan} {no-resi}",
                        ];
                        this.event.reply(failedMsg)
                            .then((data)=>{
                                console.log("Success Reply:"+data);
                            })
                            .catch((err)=>{
                                console.log("Error Reply:"+err);
                            })

                    });;           
            }
        }
        else if(textInput.includes('@help')){
            this.reply(
                [
                    'Untuk menggunakan Eksi kamu dapat mengikuti perintah berikut ini \n\Contoh : @{nama-layanan} {no-resi} \n@jne CGK7K02103326517 \n@sicepat 00005366108 \n@wahana ADG66845',
                    'INGAT! Pastikan bahwa no resi kamu adalah salah satu dari layanan JNE, Wahana, atau SiCepat',
                    'Dengan Eksi kamu juga dapat memantau no resi kamu secara otomatis loh !\nGunakan perintah berikut ini @subscribe {no-resi}',
                    'PERHATIAN! Layanan subscribe hanya bisa digunakan apabila kamu sebelumnya telah melihat resi kamu dengan Eksi'
                ]);
        }
        else{
            let sorryMsg = [
                "Maaf ya aku belum paham yang kamu mau :(",
                "Coba kamu perhatikan pesan yang kamu kirim, mungkin aja salah :)",
                "Kalau masih bingung, gunakan perintah @help untuk mengetahui bagaimana cara kerja Eksi !"    
            ];
            this.reply(sorryMsg);
        }

        this.db.ref("users").child(userId)
            .once("value",(snapshot)=>{
                if(!snapshot.exists()){
                    this.event.source.profile()
                        .then( (profile)=>{
                            this.db.ref("users").child(userId).set({
                                addedAt:admin.database.ServerValue.TIMESTAMP,
                                changedAt:admin.database.ServerValue.TIMESTAMP,
                                name:profile.displayName,
                                status:"follow"
                            });
                        });
                }
        });
        
    }   

    public groupMsg(){
    
        let textInput = this.event.message.text;
        let _valid = validate(textInput);
        let understand = _valid[0];

        if(understand){
            let input = splitInput(textInput,5);
            let output = "Ini inputmu yah : "+input;

            if(textInput.includes("bye")){
                let groupId = this.event.source.groupId;
                this.event.reply(["Kalian ga asik ah, baru sebentar dah diusir.","Yaudah bye !"])
                    .then((data)=>{
                        console.log("Success :",data);
                        this.bot.leaveGroup(groupId);
                    })
                    .catch((error)=>{
                        console.log("Error :",error);
                    });
            }

            else{
                this.event.reply(output)
                    .then((data)=>{
                        console.log("Success :",data);
                    })
                    .catch((error)=>{
                        console.log("Error :",error);
                    });
            }
        }
    }

    public locationMsg(){
        let addr = this.event.message.address;
        this.reply("Alamat :"+addr);
    }

    public imageMsg(){
        let messageId = this.event.message.id;

        this.reply("Gambar yang kamu kirim bisa dilihat dimari "+config.HOST_URL+"content/image/"+messageId);
    }

    public videoMsg(){
        let messageId = this.event.message.id;

        this.reply("Video yang kamu kirim bisa dilihat dimari "+config.HOST_URL+"content/video/"+messageId);
    }

    public audioMsg(){
        let messageId = this.event.message.id;

        this.reply("Audio yang kamu kirim bisa diakses dimari "+config.HOST_URL+"content/audio/"+messageId);
    }

    get (path){
        return fetch(path,{method : "GET", headers: this.headers, timeout:5000});
    }


    push (userId, message){
        this.bot.push(userId,message)
            .then((data)=>{
                console.log("Success Push:"+data);
            })
            .catch((err)=>{
                console.log("Error Push:"+err);
            });
    }

    reply (message){
        this.bot.reply(this.token,message)
            .then((data) => {
                console.log("Success Reply"+data);
            })
            .catch((err) => {
                console.log("Error Reply:"+err);
            })
    }

    _pushArr (userId, message){
        for(let i=0;i<message.length;i++){
            setTimeout(()=>{
                this.bot.push(userId,message[i])
                .then((data)=>{
                    console.log("Success :"+data);
                })
                .catch((err)=>{
                    console.log("Error :"+err);
                });
            },1000);
        }
    }
}

function validate(val):any[]{
    let result = [];
    if(val.includes("@jne")){
        result.push(true);
        result.push("@jne");
        result.push(5);
        return result;
    }
    else if(val.includes("@sicepat")){
        result.push(true);
        result.push("@sicepat");
        result.push(9);        
        return result;    
    }
    else if(val.includes("@wahana")){
        result.push(true);
        result.push("@wahana");
        result.push(8);        
        return result;    
    }
    else if(val.includes("@subscribe")){
        result.push(true);
        result.push("@subscribe");
        result.push(11);
        return result;
    }
    else if(val.includes("@done")){
        result.push(true);
        result.push("@done");
        result.push(6);
        return result;
    }
    result.push(false)
    return result;
}

function splitInput(val,index):string{
    return val.substring(index);
}

export default Messages;
