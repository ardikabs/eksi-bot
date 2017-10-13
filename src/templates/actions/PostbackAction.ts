

export default class PostbackAction{
    
    constructor(public label:string, public data:string, public text?:string){

    }

    build():{}{
        let action = {};
        action['type'] = "postback";
        action['label'] = this.label;
        action['data'] = this.data;
        if(this.text != null){
            action['text'] = this.text;
        }
        return action;
    }
}