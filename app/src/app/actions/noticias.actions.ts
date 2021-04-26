import { NoticiaModelo } from "../models/noticia";

export namespace NoticiasCrud {
    export class Add {
        static readonly type = "[NoticiasCrud] Add";
        constructor(public payload : NoticiaModelo){}
    }

    export class All{
        static readonly type = "[NoticiasCrud] All";
    }

    export class AllActives{
        static readonly type = "[NoticiasCrud] AllAllActives";
    }


    export class Update{
        static readonly type = "[NoticiasCrud] Update";
        constructor(public payload : NoticiaModelo){}
    }

    export class Delete {
        static readonly type = "[NoticiasCrud] Delete";
        constructor(public payload : NoticiaModelo){} 
    }
}