

export default class ConfirmTemplates{
    
        constructor(public altText:string, public text:string, public actions:{}[]){
    
        }
    
        build():{}{
            let message = {
                type: "template",
                altText: this.altText,
                template: {
                    type: "confirm",
                    text: this.text,
                    actions: this.actions
                }
              }
            
            return message;
        }
    
    
    }


// {
//     "type": "template",
//     "altText": "this is a confirm template",
//     "template": {
//         "type": "confirm",
//         "text": "Are you sure?",
//         "actions": [
//             {
//               "type": "message",
//               "label": "Yes",
//               "text": "yes"
//             },
//             {
//               "type": "message",
//               "label": "No",
//               "text": "no"
//             }
//         ]
//     }
//   }