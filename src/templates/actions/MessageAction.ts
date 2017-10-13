

export default class MessageAction{
    
    constructor(public label:string, public text:string){

    }

    build():{}{
        let action = {};
        action['type'] = "message";
        action['label'] = this.label;
        action['text'] = this.text;
        return action;
    }
}
