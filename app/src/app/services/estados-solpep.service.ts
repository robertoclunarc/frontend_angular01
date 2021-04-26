import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { EstadosSolpedModelo } from "../models/estados-solped"
import { environment } from "../../environments/environment"

@Injectable({
	providedIn: 'root'
})
export class EstadosSolpepService {

	API_URL = environment.apiUrl + "estadosolped";

	constructor(private _http: HttpClient) { }

	getAll(): Promise<EstadosSolpedModelo[]> {
		return this._http.get<EstadosSolpedModelo[]>(this.API_URL).toPromise();
	}

}
