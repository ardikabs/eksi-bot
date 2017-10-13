
export default class ButtonTemplates{

    public thumbnailImg:string;
    constructor(public altText:string, public title:string, public text:string, public actions:{}[]){

    }

    setThumbnailImg(URL:string){
        this.thumbnailImg = URL; 
    }

    build():{}{
        let message = {
            type: "template",
            altText: this.altText,
            template: {
                type: "buttons",
                thumbnailImageUrl: this.thumbnailImg,
                title: this.title,
                text: this.text,
                actions: this.actions
            }
          }
        
        return message;
    }


}

// {
//     "type": "template",
//     "altText": "this is a buttons template",
//     "template": {
//         "type": "buttons",
//         "thumbnailImageUrl": "https://example.com/bot/images/image.jpg",
//         "title": "Menu",
//         "text": "Please select",
//         "actions": [
//             {
//               "type": "postback",
//               "label": "Buy",
//               "data": "action=buy&itemid=123"
//             },
//             {
//               "type": "postback",
//               "label": "Add to cart",
//               "data": "action=add&itemid=123"
//             },
//             {
//               "type": "uri",
//               "label": "View detail",
//               "uri": "http://example.com/page/123"
//             }
//         ]
//     }
//   }