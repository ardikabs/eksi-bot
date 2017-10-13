
export default class ActionTemplates{

    public value:{}[];
    constructor(){

    }

    setValue(value:{}){
        if(value instanceof Object){
            this.value.push(value);            
        }
    }

    getValue():{}[]{
        return this.value;
    }
}