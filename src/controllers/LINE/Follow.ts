
import admin from "../../config/admin";

class Follow{

    constructor(public event:any){
        this.greetingMsg();
    }

    public greetingMsg(){
        this.event.source.profile()
            .then( (profile)=>{

                // Firebase Section
                let db = admin.database();
                let usersRef = db.ref("users");
                usersRef.child(profile.userId)
                        .once("value",(snapshot)=>{
                            if(snapshot.exists()){
                                usersRef.child(profile.userId).update({
                                    name:profile.displayName,
                                    status:"follow",
                                    changedAt: admin.database.ServerValue.TIMESTAMP                    
                                });                
                            }
                            else{
                                usersRef.child(profile.userId).set({
                                    name:profile.displayName,
                                    addedAt: admin.database.ServerValue.TIMESTAMP,
                                    status:"follow",
                                    changedAt: admin.database.ServerValue.TIMESTAMP                    
                                }, (err)=>{
                                    if(err){
                                        console.log("Data could not be saved :"+err);
                                    }
                                    else{
                                        console.log("Data saved successfully");
                                    }
                                });
                
                            }

                        });

                // LINE Section
                let greetingMessage = [
                    `Terima kasih ${profile.displayName} telah menambahkan aku menjadi temanmu !`,
                    "Eksi akan membantumu mengetahui informasi RESI pengiriman barang kamu loh",
                    "Untuk memulainya, gunakan perintah berikut contoh: @cek {no-resi-kamu}",
                    "Gunakan perintah @help untuk mengetahui aku lebih lanjut yah."
                ] 
                this.event.reply(greetingMessage)
                    .then((data)=>{
                        console.log("Success :",data);
                    })
                    .catch((error)=>{
                        console.log("Error :",error);
                    });
            })
            .catch( (err)=>{
                console.log("Error :"+err);
            });
    }
}

export default Follow;

