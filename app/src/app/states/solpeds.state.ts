import { SolpedModelo } from "../models/solped";
import { SolpedsActions } from "../actions/solpeds.actions";
import { SolPedService } from "../services/sol-ped.service";

import { Injectable } from '@angular/core';

import { State, Action, StateContext, Selector, createSelector } from "@ngxs/store";
import { patch, append, insertItem } from "@ngxs/store/operators";


export interface SolpedStateModel {
    solpeds: SolpedModelo[],
    solpedSelect: SolpedModelo
} 

@State<SolpedStateModel>({
    name: "solpeds",
    defaults: {solpeds: [], solpedSelect: null}
})

@Injectable()
export class SolpedState{

    @Selector()
    public static getAll(state: SolpedStateModel) { return state.solpeds }

    //Esto no funciono porque no logro pasar el state model
    /* @Selector()
    public static missolped(state: SolpedStateModel, idusuario : number) { return state.solpeds.filter((sol) => {return sol.idSegUsuario == idusuario}) } */
    
    
    /*public static missolped(idusuario : number) { 
        return createSelector([SolpedState], (state: SolpedStateModel[]) =>{
            return state.filter((s)=>s.solpeds.filter((sol)=>sol.idSegUsuario = idusuario));
        }  
    } */

    static misSolped (idusuario :number) {
        return createSelector([SolpedState], (state: SolpedModelo[]) => {
            return state.filter(solp => solp.idSegUsuario == idusuario);
          });
    }

    constructor(private srvSolped: SolPedService){}

    @Action(SolpedsActions.Add)
    async addSolped(ctx: StateContext<SolpedStateModel>, { payload }: SolpedsActions.Add){
        await this.srvSolped.nuevoSolPed(payload);
        ctx.setState(
            patch({
                //solpeds: append([payload])
                solpeds: insertItem<SolpedModelo>(payload, 0)
            })
        );
    }

    @Action(SolpedsActions.AllSolpeds)
    async allSolped(ctx: StateContext<SolpedStateModel>){
        const result = await this.srvSolped.getTodosP();
        ctx.setState(
            patch({ 
                solpeds: result,
            })
        );
    }
}

