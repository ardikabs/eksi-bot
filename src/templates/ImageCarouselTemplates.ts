
export default class ImageCarouselTemplates{
    
    constructor(public altText:string, public column:{}[]){

    }

    build():{}{
        let message = {
            type: "template",
            altText: this.altText,
            template: {
                type: "image_carousel",
                columns: this.column
            }
        }
        
        return message;
    }

}