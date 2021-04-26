import {SolpedModelo} from "../models/solped";

export namespace SolpedsActions {
    export class Add {
        static readonly type = "[Solpeds] Add";
        constructor(public payload : SolpedModelo){}
    }
    export class AllSolpeds {
        static readonly type = "[Solpeds] AllSolpeds";
    }
}