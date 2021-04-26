import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environment } from 'src/environments/environment';
import { Tipomedida } from '../models/tipomedida';

@Injectable({
  providedIn: 'root'
})
export class TipomedidaService {

  private url: string;
  idAdmTipoMedida: number;
  private url2: string;

  constructor(private http: HttpClient) {
    console.log('service data is working');

    this.url = environment.apiUrl + 'tipomedidas';
  }

  consultarTodos(): Promise<Tipomedida[]> {
    let url = `${this.url}`;
    return this.http.get<Tipomedida[]>(this.url).toPromise();
  }
  registrar(nuevatipomedida: Tipomedida) {

    return this.http.post(this.url, nuevatipomedida).toPromise();
  }

  actualizar(actualtipomedida: Tipomedida): Promise<Tipomedida> {

    const url = `${this.url}/${actualtipomedida.idAdmTipoMedida}`;
    return this.http.put<Tipomedida>(url, actualtipomedida).toPromise();
  }

  eliminar(idAdmTipoMedida: number) :Promise<any> {
    const url = `${this.url}/${idAdmTipoMedida}`;

    return this.http.delete(url).toPromise();
  } 
  /* 
  consultarUno(idtipo: number): Promise<Tipomedida> {
  
    const url2 = `${this.url}/${idtipo}`;
    
    return this.http.get<Tipomedida>(this.url2).toPromise();
    }
  
    
     */
}
