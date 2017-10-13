import admin from "../../config/admin";

class Unfollow{
    
        constructor(public event:any){
            this.goodbyeMsg();
        }
    
        public goodbyeMsg(){
            // Firebase Section
            let db = admin.database();
            let users = db.ref("users");
            users.child(this.event.source.userId).update({
                status: "unfollow",
                changedAt: admin.database.ServerValue.TIMESTAMP
            }, (err)=>{
                if(err){
                    console.log("Data could not be saved :"+err);
                }
                else{
                    console.log("User unfollowed saved successfully :"+this.event.source.userId);
                }
            });            
        }
    }
    
    export default Unfollow;
    
    