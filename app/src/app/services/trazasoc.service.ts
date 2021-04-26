import { TrazaOc } from './../models/traza-oc';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class TrazasocService {
	private URL_nodeAPI = environment.solpedURL + "trazaoc";

	constructor(private http: HttpClient) { }

	insertTrazaOc(traza: TrazaOc) {
		return this.http.post(this.URL_nodeAPI, traza);
	}
}
