import admin from '../../config/admin';
import config from '../../config/main';
import * as linebot from 'linebot';
import * as fetch from 'node-fetch';
import * as schedule from 'node-schedule';
declare const Promise: any;

class FirebaseHandler{

    headers: {};
    message: any;
    subsRef = admin.database().ref("subscribe");
    constructor(public bot:linebot){
        this.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        };

        this.scheduleJob();
    }

    scheduleJob(){
        const rule1 = new schedule.RecurrenceRule();
        const rule2 = new schedule.RecurrenceRule();
        const rule3 = new schedule.RecurrenceRule();
        const ruleReminder = new schedule.RecurrenceRule();  
        
        rule1.hour = 3;rule1.minute = 0;
        rule2.hour = 9;rule2.minute = 0;
        rule3.hour = 14;rule3.minute = 0;
        ruleReminder.hour = 16;ruleReminder.minute = 0;      
      
        schedule.scheduleJob(rule1,()=>{
            console.log("Running at 10.00 WIB");          
            this.subsRef.off();            
            this.notification();
        });
        schedule.scheduleJob(rule2,()=>{
            console.log("Running at 16.00 WIB");
            this.subsRef.off();            
            this.notification();            
        });
        schedule.scheduleJob(rule3, ()=>{
            console.log("Running at 21.00 WIB");
            this.subsRef.off();            
            this.notification();            
        }); 

        schedule.scheduleJob(ruleReminder, ()=>{
            console.log("Reminder For Share Information");
            this.reminder();            
        }); 
        
    }

    notification(){
        let db = admin.database();
        let hist = db.ref("history");
        this.subsRef.on("child_added",(snapshot)=>{
            let userId:string = snapshot.key;
            let data = snapshot.val();
            Object.keys(data).forEach((key)=>{
                let _resi = key;
                let resiRef = hist.child(userId).child(_resi);

                resiRef.once("value",(snapshot)=>{
                    let data = snapshot.val();
                    let _provider = data.provider;
                    let lastManifestLength = data.lastManifest;      
                    
                    let params = "?jasa="+_provider+"&resi="+_resi;
                    this.get(config.URL_API+params)
                        .then((res)=>{
                            Promise.resolve(res.json())
                                .then((val)=>{
                                    if(lastManifestLength < val.manifest.length){
                                        this.message = [
                                            "Hei! Berikut ini adalah informasi terbaru dari no resi - "+_resi
                                        ];
                                        let sumOfData = val.manifest.length - lastManifestLength;
                                        if(sumOfData>1){
                                            if(sumOfData > 4){
                                                for(let i=val.manifest.length-4;i<val.manifest.length;i++){
                                                    this.message.push("Tanggal : "+ val.manifest[i].manifest_date+"\nKeterangan : "+ val.manifest[i].manifest_desc);
                                                }
                                            }
                                            else{
                                                for(let i=lastManifestLength;i<val.manifest.length;i++){
                                                    this.message.push("Tanggal : "+ val.manifest[i].manifest_date+"\nKeterangan : "+ val.manifest[i].manifest_desc);
                                                }
                                            }
                                        }
                                        else{
                                            let _index = val.manifest.length - 1;
                                            this.message.push("Tanggal : "+ val.manifest[_index].manifest_date+"\nKeterangan : "+ val.manifest[_index].manifest_desc);    
                                        }

                                        this.push(userId,this.message);                                            
                                        resiRef.update({
                                            lastManifest:val.manifest.length
                                        })
                                        

                                    }
                                })
                                .catch((err)=>{

                                });
                        })
                        .catch((err)=>{
                            console.log("Error Request :"+err);
                        });          
                    
                });

            });
        });


  
    }

    reminder(){
        let db = admin.database();
        let usersRef = db.ref("users");

        usersRef.once("value",(snapshot)=>{
            let data = snapshot.val();

            Object.keys(data).forEach((key)=>{
                let userId = key;
                this.message = [
                    "Hai! Mau mengingatkan saja, jika barang kamu telah sampai.\nGunakan perintah berikut ini yah: @done {no-resi}",
                    "Oh iya! Jika kalian merasa terbantu dengan layanan Eksi, sebarkan ke saudara, kerabat, teman, pacar atau gebetan kalian yah!\nBiar mereka juga terbantu,hehe",
                    "Line@ : @lhh7524d. Terima kasih !"
                ]
                this.push(key,this.message);
            });
    
        });
    }

    get(path){
        return fetch(path,{method : "GET", headers: this.headers, timeout:5000});        
    }

    push(userId,message){
        this.bot.push(userId,message)
            .then((data)=>{
                console.log("Success Push:"+data);
            })
            .catch((err)=>{
                console.log("Error Push:"+err);
            });
    }

}

export default FirebaseHandler;