import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { alm_tipos_movimiento } from '../models/alm-tipos-movimientos';
import {Observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AlmTiposMovimientoService {  
  
  api_almTiposMov = environment.recepcionProductoUrl + "tipos";
  
  constructor(private http: HttpClient) { }
  
  nuevo(nuevo: alm_tipos_movimiento): Observable<alm_tipos_movimiento> {
    return this.http.post<alm_tipos_movimiento>(this.api_almTiposMov, nuevo);
  }

  actualizar(nuevo: alm_tipos_movimiento): Observable<alm_tipos_movimiento> {
    let uri = `${this.api_almTiposMov}/${nuevo.idAlmTipoMov}`;
    return this.http.put(uri, nuevo);
  }
  
  delete(id: number): any {
    let uri = `${this.api_almTiposMov}/${id}`;
    return this.http.delete(uri);
  }

  getOne(id: number): Observable<alm_tipos_movimiento> {
    let uri = `${this.api_almTiposMov}/${id}`;
    return this.http.get<alm_tipos_movimiento>(uri);
  }

  getAll(): Promise<alm_tipos_movimiento[]>  {
    let uri = `${this.api_almTiposMov}`;
    return this.http.get<alm_tipos_movimiento[]>(uri).toPromise();
  }

}