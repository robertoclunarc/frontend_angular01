import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Unidadmedidas } from '../models/unidadmedidas';



@Injectable({
  providedIn: 'root'
})
export class UnidadmedidasService {

  url: string;
  idAdmUnidadMedida: number;
  

  constructor(private http: HttpClient) {
    console.log('service data is working');
    this.url = environment.apiUrl + 'medidasporunidad';

  }

  consultarTodos(): Promise<Unidadmedidas[]> {
    return this.http.get<Unidadmedidas[]>(this.url).toPromise();
  }


  actualizar(actual: Unidadmedidas): Promise<Unidadmedidas> {

    const url = `${this.url}/${actual.idAdmUnidadMedida}`;
    return this.http.put<Unidadmedidas>(url, actual).toPromise();
  }
  
  nuevaUmedida(umedida: Unidadmedidas): Promise<Unidadmedidas> {

    return this.http.post<Unidadmedidas>(this.url, umedida).toPromise();

  }

  eliminarUmedida( idAdmUnidadMedida: number): Promise<any> {
    const url = `${this.url}/${idAdmUnidadMedida}`;
    return this.http.delete(url).toPromise();

  }

 
}
