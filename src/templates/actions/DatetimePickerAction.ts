

export default class DatetimePickerAction{
    
    constructor(public label:string, public data:string, public mode:string, public initial:string, public max:string, public min:string){

        // Mode
        // Action mode
        // date: Pick date
        // time: Pick time
        // datetime: Pick date and time

        // full-date
        // Max: 2100-12-31
        // Min: 1900-01-01

        // time-hour ":" time-minute
        // Max: 23:59
        // Min: 00:00
        
        // full-date ("T"/"t") time-hour ":" time-minute
        // Max: 2100-12-31T23:59
        // Min: 1900-01-01T00:00
    }

    build():{}{
        let action = {};
        action['type'] = "datetimepicker";
        action['label'] = this.label;
        action['data'] = this.data;
        action['mode'] = this.mode;
        action['initial'] = this.initial;
        action['max'] = this.max;
        action['min'] = this.min;
        return action;
    }
}
