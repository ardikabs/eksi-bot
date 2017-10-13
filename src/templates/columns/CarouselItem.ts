
export default class CarouselItem{

    constructor(public thumbImg:string, public title:string, public text:string, public actions:{}[]){

    
    }

    build():{}{
        let col = {};
        col['thumbnailImageUrl'] = this.thumbImg;
        col['title'] = this.title;
        col['text'] = this.text;
        col['actions'] = this.actions;
        return {};
    }
}