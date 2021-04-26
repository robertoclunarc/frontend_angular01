import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { ResponFuncionales } from "../models/respon-funcionales";

import { environment } from "../../environments/environment";


@Injectable({
	providedIn: 'root'
})
export class ResponsablesFuncionalesService {

	URL_todos: string = environment.apiUrl + "respofuncionales";
	URL_porprod: string = environment.apiUrl + "respofunporprod";

	constructor(private http: HttpClient) { }


	getTodosResponsables(): Promise<ResponFuncionales[]> {
		return this.http.get<ResponFuncionales[]>(this.URL_todos).toPromise();
	}

	getTodosPorProducto(idProducto: number): Promise<ResponFuncionales[]> {
		return this.http.get<ResponFuncionales[]>(this.URL_porprod + "/" + idProducto).toPromise();
	}

	insertarRespoFuncional(respo: ResponFuncionales){
		return this.http.post(this.URL_todos, respo).toPromise();
	}

	delPorProducto(idProducto: number) {
		return this.http.delete(this.URL_porprod + "/" + idProducto).toPromise();
	}

}
