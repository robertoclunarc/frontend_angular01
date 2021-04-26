import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PreguntaModelo } from '../models/pregunta-modelo';
import { environment } from "../../environments/environment";

@Injectable({
	providedIn: 'root'
})
export class PreguntaService {

	private API_URL = environment.apiUrl + "preguntas";

	constructor(private http: HttpClient) { }

	getPreguntasGerencia(idGerencia): Promise<PreguntaModelo[]> {
		return this.http.get<PreguntaModelo[]>(this.API_URL + "/" + idGerencia).toPromise();
	}

}
