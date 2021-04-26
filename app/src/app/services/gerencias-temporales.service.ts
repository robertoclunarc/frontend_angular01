import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";

import { GerenciasTemporales } from "../models/gerencias-temporales";
import { GerenciasModelo } from "../models/gerencias";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GerenciasTemporalesService {

    constructor(private http: HttpClient) { }

    API_url_asignadas: string = environment.apiUrl + "gerenciastempusuario";
    API_url_NOasignadas: string = environment.apiUrl + "gerenciastempnousuario";
    API_url_gen_temp: string = environment.apiUrl + "gerenciastemp";

    getGerenciasTempIngresadas(idusuario: number) {
        return this.http.get<GerenciasModelo[]>(this.API_url_asignadas + "/" + idusuario).toPromise()
            .then(data => {
                return data;
            })
            .catch();
    }

    getGerenciasTempNOIngresadas(idusuario: number, idcargo: number) {
        return this.http.get<GerenciasModelo[]>(this.API_url_NOasignadas + "/" + idusuario + "/" + idcargo).toPromise()
            .then(data => {
                return data;
            })
            .catch();
    }

    nuevaGerenciaTempUsuario(genTemp: GerenciasTemporales) {
        return this.http.post(this.API_url_gen_temp, genTemp).toPromise()
            .then(data => {return data})
            .catch();
    }

    borrarGerenciaTempUsuario(genTemp: GerenciasTemporales) {
        return this.http.delete(this.API_url_gen_temp + "/" + genTemp.idSegUsuario + "/" + genTemp.idConfigGerencia).toPromise()
            .then(data => {return data})
            .catch();
    }

}
