import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ProductoImagen} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductoImagenesService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'productos'; // adm_producto_imagenes.php
  }

  consultarPorId(idAdmProducto: number): Observable<ProductoImagen[]> {

    let apiURL = `${this.url}/${idAdmProducto}/imagenes`;

   // console.log(apiURL);
    return this.http.get<ProductoImagen[]>(apiURL);
  }

  insertar(imagen: ProductoImagen) {

    let apiURL = `${this.url}/imagenes`;
    return this.http.post(apiURL, imagen).toPromise();
  }

  eliminar(id: number) {

    let apiURL = `${this.url}/imagenes/`+ id;
    return this.http.delete(apiURL).toPromise();
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
