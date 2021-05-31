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
		return this.http.get<ProveedorModelo>(this.api_URL + "/" + id.toString());
	}

	obtenerTodos(): Observable<ProveedorModelo[]> {
		return this.http.get<ProveedorModelo[]>(this.api_URL + "/consultar");
	}

	save(newprovee: ProveedorModelo) {
		return this.http.post(this.api_URL + "/insertar", newprovee);
	}

	update(idprovee: number, provee : ProveedorModelo){
		return this.http.put(this.api_URL + `/actualizar/${idprovee}`, provee);
	}
	
	delete(idprovee: number){
		return this.http.delete(this.api_URL + `/eliminar/${idprovee}`);
	}

}
