

export default class UriAction{
    
    constructor(public label:string, public uri:string){

    }

    build():{}{
        let action = {};
        action['type'] = "uri";
        action['label'] = this.label;
        action['uri'] = this.uri;
        return action;
    }
}
