import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule }  from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PuestoProducto } from '../models/PuestoProducto';
import { Puesto } from '../models/almacen';
import { Producto } from '../models/producto';
import { Almacenes } from '../models/almacenes'


@Injectable({
  providedIn: 'root'
})
export class FtAlmacenProductoService {

  url: string;
  url2: string;
  data: any[];
  url3: string;
  URI:  string;
  //puesto: Puesto;
  producto: Producto


  //puestoProducto: PuestoProducto = {};


  constructor(private http: HttpClient, private htttpModule: HttpClientModule) {

    this.url = environment.AdminAlmacenesUrl + 'tree';
    this.URI = environment.AdminAlmacenesUrl + 'puestoproducto';
    this.url3 = environment.apiUrl + 'productos';

   }
/////// arma diagrama de almacenes
   tree() {
     return this.http.get<any>(this.url).toPromise()
   }

   /* getPuestoProductobyId(id: number): Promise<any> {
     let url2 = `${this.url2}/${id}`;
     return this.http.get(url2).toPromise();

   } */

/*    UpdatePuestodelProducto(idProducto, idPuestoAlmacen) {
     let url2 = `${this.url2}/${idProducto}`;
     return this.http.put(url2, idPuestoAlmacen).toPromise();
   } */
   

   addProducto(almacen: Almacenes) {
     let URI = `${this.URI}/${almacen.idAlmacenes}`;
     return this.http.put(URI, almacen).toPromise()

   }

   consultarProductoporId(idAdmProducto: number): Promise<any>{
    let apiURL = `${this.url3}/${idAdmProducto}`;
		return this.http.get<Producto>(apiURL).toPromise();
   }




  }
