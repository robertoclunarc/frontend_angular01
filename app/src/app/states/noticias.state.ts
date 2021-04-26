import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators';

import { NoticiaModelo } from "../models/noticia";
import { NoticiasCrud } from "../actions/noticias.actions";
import { NoticiasService } from "../services/noticias.service";

export interface NoticiasStateModel {
    noticias: NoticiaModelo[],
    selectedNoticia: NoticiaModelo
}

@State<NoticiasStateModel>({
    name: 'noticias',
    defaults: { noticias: [], selectedNoticia: null }
})

@Injectable()
export class NoticiasState {

    constructor(private svrNoticias: NoticiasService) { }

    @Selector()
    public static getAll(state: NoticiasStateModel) { return state.noticias }

    @Selector()
    static getAllActives(state: NoticiasStateModel) { return state.noticias.filter((noti) => { return noti.activo == "1" }); }


    @Action(NoticiasCrud.Add)
    async addNoticia(ctx: StateContext<NoticiasStateModel>, { payload }: NoticiasCrud.Add) {
        const newNoticia: NoticiaModelo = await this.svrNoticias.nuevaNoticiaP(payload);
        //hacerlo con el getstate para poder, despues de insertar ordenar el arreglo para volverlo a state con setstate

        ctx.setState(
            patch({
                noticias: insertItem<NoticiaModelo>(newNoticia[0], 0)
            })
        );
    }

    @Action(NoticiasCrud.All)
    async allNoticias(ctx: StateContext<NoticiasStateModel>) {
        //if (!ctx.getState().noticias || ctx.getState().noticias.length <= 0) {
        let result: NoticiaModelo[] = await this.svrNoticias.getAllPromise();
        //let result: NoticiaModelo[] = [{ idConfigNoticia: 111111, titulo: "INICIADO" }]
        ctx.setState(
            patch({
                noticias: result
            })
        );
        //}
    }

    @Action(NoticiasCrud.Update)
    async updateNoticia(ctx: StateContext<NoticiasStateModel>, { payload }: NoticiasCrud.Update) {
        const result = await this.svrNoticias.actualizarNoticiaP(payload);
        ctx.setState(
            patch({
                noticias: updateItem<NoticiaModelo>(noti => noti.idConfigNoticia == payload.idConfigNoticia, result[0])
            })
        );

    }

    @Action(NoticiasCrud.Delete)
    async deleteNoticia(ctx: StateContext<NoticiasStateModel>, { payload }: NoticiasCrud.Delete) {
        await this.svrNoticias.eliminarNoticiaP(payload);
        ctx.setState(
            patch({
                noticias: removeItem<NoticiaModelo>(noti => noti.idConfigNoticia == payload.idConfigNoticia)
            })
        );
    }

}