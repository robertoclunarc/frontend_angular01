import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AreaNegocioModelo } from '../../models/area-negocio';
//import { LogTransacService } from '../../services/logtransac.service';

@Injectable({
    providedIn: 'root'
  })
  export class AreaNegocioService {
    private url: string;
    genAreaNeg: AreaNegocioModelo={};
    areasNegocios: AreaNegocioModelo[];
  
    constructor(private http: HttpClient) { 
      this.url = environment.generalesUrl + 'area_negocio';
    }

    getTodos(): Observable<AreaNegocioModelo[]> {
		return this.http.get<AreaNegocioModelo[]>(this.url + '/consultar')
			.pipe(
				tap(result =>{}),
				catchError(this.handleError('getTodosAreaNegocio ', []))
			);
	}

    viewFromAnyField(areaNeg: AreaNegocioModelo, idConfigGerencia?: number): Observable<AreaNegocioModelo[]> {
        let _id: any;
        let _nombre = areaNeg.nombre;
        let _desc = areaNeg.descripcion; 
        let _cod = areaNeg.codigo;
        let _idtipo = areaNeg.idAdmTipo;
        let _idGcia: any;
        
        if (areaNeg.idGenAreaNegocio==null){
          _id="NULL";
        }else{
          _id= areaNeg.idGenAreaNegocio.toString();
        }
        if (areaNeg.nombre==null){
          _nombre="NULL";
        }
        if (areaNeg.descripcion==null){
          _desc="NULL";
        }
        if (areaNeg.codigo==null){
            _cod="NULL";
        } 
        if (areaNeg.idAdmTipo==null){
            _idtipo="NULL";
        }
        if (_idGcia==null){
            _idGcia="NULL";
        }else{
            _idGcia= idConfigGerencia.toString();
        }
    
        const url = `${this.url}/filtrar/${_id}/${_nombre}/${_cod}/${_desc}/${_idGcia}/${_idtipo}`;
    
        return this.http.get<AreaNegocioModelo[]>(url)
          .pipe(
            tap(result => this.log(`fetched Activo`)),
            catchError(this.handleError('viewFromAnyField', []))
          );
    }

    getTodosPorGerencias(idGernecia: number) {
        const areaNeg: AreaNegocioModelo = {
            idGenAreaNegocio: null,
            nombre: null,
            codigo: null,
            descripcion: null,
            idAdmTipo: null,
        }
		return this.viewFromAnyField(areaNeg, idGernecia);
	}

    getDetalleAreaNegocio(idGenAreaNegocio: number) {
        const areaNeg: AreaNegocioModelo = {
            idGenAreaNegocio: idGenAreaNegocio,
            nombre: null,
            codigo: null,
            descripcion: null,
            idAdmTipo: null,
        }
		return this.viewFromAnyField(areaNeg);
	}

    nuevoAreaNegocio(AreaNegocio: AreaNegocioModelo) {

        return this.http.post(this.url + '/insertar', AreaNegocio).pipe(
          tap(result => {
          }),
          catchError(this.handleError('registrar activo', []))
        );
    }
    
    actualizarAreaNegocio(AreaNegocio: AreaNegocioModelo) {        
        const url = `${this.url}/actualizar/${AreaNegocio.idGenAreaNegocio}`;
    
        return this.http.put(url, AreaNegocio).pipe(
          tap(result => {
          }),
          catchError(this.handleError('actualizando Activo', []))
        );
    }
    
    eliminarAreaNegocio(AreaNegocio: AreaNegocioModelo){    
        const url = `${this.url}/eliminar/${AreaNegocio.idGenAreaNegocio}`;
        
        return this.http.delete(url).pipe(
          tap(result => {
          }),
          catchError(this.handleError('error eliminando Activo', []))
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