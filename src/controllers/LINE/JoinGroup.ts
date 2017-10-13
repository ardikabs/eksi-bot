
class JoinGroup{
    
        constructor(public event:any){
            this.greetingMsg();
        }
    
        public greetingMsg(){
            let greetingMessage = [
                `Terima kasih telah menambahkan aku di grup laknat ini !`,
                "Untuk memulai percakapan denganku panggil @eksi yah !"
            ] 
            this.event.reply(greetingMessage)
                .then((data)=>{
                    console.log("Success :",data);
                })
                .catch((error)=>{
                    console.log("Error :",error);
                });
        }
    }
    
    export default JoinGroup;
    
    