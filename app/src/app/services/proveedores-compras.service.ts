import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { ProveedorModelo } from "../models/proveedor-modelo";

@Injectable({
	providedIn: 'root'
})
export class ProveedoresComprasService {

	api_URL: string = environment.solpedURL + "proveedores";

	constructor(private http: HttpClient) { }

	getAll(): Promise<ProveedorModelo[]> {
		return this.http.get<ProveedorModelo[]>(this.api_URL).toPromise();
	}

	getOne(id: number): Observable<ProveedorModelo> {
		return this.http.get<ProveedorModelo>(this.api_URL + "/"+ id.toString());
	}

	obtenerTodos() : Observable<ProveedorModelo[]>{
		return this.http.get<ProveedorModelo[]>(this.api_URL + "/consultar");
	}

}
