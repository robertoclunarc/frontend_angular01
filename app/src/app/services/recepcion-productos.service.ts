import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { recepcionOC } from '../../app/models/recepcionOC';
import { requisicion } from '../models/requisicion'
import { MovimientoAlmacen } from '../models/MovimientoAlmacen';
import { recepcion_detalle } from '../models/recepcion_detalle';
import { detalleOcModelo } from '../models/oc-Detalle';
import { inventario_resumen } from '../models/inventario';


@Injectable({
  providedIn: 'root'
})
export class RecepcionProductosService {
  
  api_URL: string = environment.recepcionProductoUrl + "requireoc";
  urlSimple: string = environment.recepcionProductoUrl + "requireocsimple";
  api_detall: string = environment.recepcionProductoUrl + "detalleRP";
  _url: string = environment.recepcionProductoUrl + "recepcion-producto";
  movUrl: string = environment.recepcionProductoUrl + "movimiento";
  api_inventario = environment.recepcionProductoUrl + "inventario";


  constructor(private http: HttpClient) { }

  ObtenerDetalleOc(codigo: string): Promise<recepcionOC[]> {
    let url = `${this.api_URL}/${codigo}`;
    return this.http.get<recepcionOC[]>(url).toPromise();
  }

  nuevaRequisicion(nueva): Promise <requisicion> {
    return this.http.post<requisicion>(this._url, nueva).toPromise();
  }

  nuevoMovimientoAlmacen(nueva): Promise <MovimientoAlmacen> {
    return this.http.post<MovimientoAlmacen>(this.movUrl, nueva).toPromise();
  }

  nuevoDetalleRecepcion(nuevo): Promise<recepcion_detalle> {
    return this.http.post<recepcion_detalle>(this.api_detall, nuevo).toPromise()
  }

  //busca recepciones pre existentes, por el id de la orden de compra
  FindRecepcion(id) {
    let uri = `${this._url}/${id}`;
    return this.http.get<requisicion>(uri).toPromise();
  }

  AnularRecepcion(requisicion: requisicion): Promise<requisicion> {
    let uri = `${this._url}/${requisicion.idRecepcionOC}`;
    return this.http.put<requisicion>(uri, requisicion).toPromise();
  }

  UpdateOCdetalle(detalleOcModelo: detalleOcModelo) {
    let url = `${this.api_URL}/${detalleOcModelo.idOcDetalle}`;
    return this.http.put<detalleOcModelo>(url, detalleOcModelo).toPromise();
  }

  NuevoRegInv(inventario_resumen: inventario_resumen): Promise<inventario_resumen> {
    
    return this.http.post<inventario_resumen>(this.api_inventario, inventario_resumen).toPromise();

  }
  buscarRegInv( inventario_resumen:  inventario_resumen) {
    let uri = `${this.api_inventario}/${inventario_resumen}`;
    return this.http.get<inventario_resumen>(uri).toPromise();
  }

  actualizarInventario( inventario_resumen: inventario_resumen) {
    let uri =`${this.api_inventario}/${ inventario_resumen.id_Producto}`;
    return this.http.put<inventario_resumen>(uri, inventario_resumen).toPromise();
  }
}