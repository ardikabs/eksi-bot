
export default class CarouselItem{
    
    constructor(public imgUrl:string, public action:{}){
    
    }

    build():{}{
        let col = {};
        col['imageUrl'] = this.imgUrl;
        col['action'] = this.action;
        return {};
    }
}