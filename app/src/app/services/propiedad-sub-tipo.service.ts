import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SubTipoClasificacion, Propiedad, PropiedadSubTipo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PropiedadSubTipoService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'propiedadsubtipo';
  }

  registrar(subTipoClasificacion: SubTipoClasificacion, idAdmPropiedad) {
   
    let propiedadSubTipo: PropiedadSubTipo={};
    propiedadSubTipo.idAdmSubTipoClasificacion = subTipoClasificacion.idAdmSubTipoClasificacion;
    propiedadSubTipo.idAdmPropiedad =  idAdmPropiedad;      
    
    return this.http.post(this.url, propiedadSubTipo).pipe(
      tap(result => {
      }),
      catchError(this.handleError('registrar SubTipoClasificacion', []))
    );
  }

  eliminar(idAdmSubTipoClasificacion: number, idAdmPropiedad: any) {

    const url = `${this.url}/${idAdmSubTipoClasificacion}/${idAdmPropiedad}`;

    return this.http.delete(url).pipe(
      tap(result => {
      }),
      catchError(this.handleError('error eliminando SubTipoClasificacion', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log('UserService: ' + message);
  }

}
