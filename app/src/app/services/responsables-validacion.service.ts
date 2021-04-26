import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { ResponsablesValidacion } from "../models/respon-validacion";

import { environment } from "../../environments/environment";


@Injectable({
	providedIn: 'root'
})
export class ResponsablesValidacionService {

	URL_todos: string = environment.apiUrl + "respovalidacion";
	URL_porprod: string = environment.apiUrl + "respovalporprod";

	constructor(private http: HttpClient) { }


	getTodosResponsables(): Promise<ResponsablesValidacion[]> {
		return this.http.get<ResponsablesValidacion[]>(this.URL_todos).toPromise();
	}

	getTodosPorProducto(idProducto: number): Promise<ResponsablesValidacion[]> {
		return this.http.get<ResponsablesValidacion[]>(this.URL_porprod + "/" + idProducto).toPromise();
	}

	insertarRespoValidacion(respo: ResponsablesValidacion) {
		return this.http.post(this.URL_todos, respo).toPromise();
	}

	delPorProducto(idProducto: number) {
		return this.http.delete(this.URL_porprod + "/" + idProducto).toPromise();
	}

}
