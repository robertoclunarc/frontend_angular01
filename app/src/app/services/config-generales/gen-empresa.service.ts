import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EmpresaModelo } from '../../models/empresa';

@Injectable({
    providedIn: 'root'
  })
  export class EmpresaService {
    private url: string;
    empresa: EmpresaModelo={};
    empresas: EmpresaModelo[];
  
    constructor(private http: HttpClient) { 
      this.url = environment.generalesUrl + 'empresas';
    }

    getTodosLosActivos(): Observable<EmpresaModelo[]> {
		return this.http.get<EmpresaModelo[]>(this.url + '/consultar')
			.pipe(
				tap(result => console.log(`Resultado Area Negocios Exitoso`)),
				catchError(this.handleError('getTodosAreaNegocio ', []))
			);
	}

    viewFromAnyField(empr: EmpresaModelo): Observable<EmpresaModelo[]> {
        let _id: any;
        let _nombre = empr.nombre_empresa;        
        let _rif = empr.rif;
        let _bd = empr.base_de_datos;
        let _fecha = empr.fecha_ope;
        let _cerrada: any;
        
        if (empr.IdGenEmpresa==null){
          _id="NULL";
        }else{
          _id= empr.IdGenEmpresa.toString();
        }
        if (empr.nombre_empresa==null){
          _nombre="NULL";
        }
        if (empr.rif==null){
          _rif="NULL";
        }
        if (empr.base_de_datos==null){
            _bd="NULL";
        } 
        if (empr.fecha_ope==null){
            _fecha="NULL";
        }
        if (empr.cerrada==null){
            _cerrada="NULL";
        }else{
            _cerrada= empr.cerrada;
        }
    
        const url = `${this.url}/filtrar/${_id}/${_nombre}/${_rif}/${_bd}/${_fecha}/${_cerrada}`;
    
        return this.http.get<EmpresaModelo[]>(url)
          .pipe(
            tap(result => this.log(`fetched Activo`)),
            catchError(this.handleError('viewFromAnyField', []))
          );
    }

    getTodos() {
        const empr: EmpresaModelo = {
            IdGenEmpresa: null,
            nombre_empresa: null,
            rif: null,
            base_de_datos: null,
            fecha_ope: null,
            cerrada: null
        }
		return this.viewFromAnyField(empr).toPromise();
	}    

    nuevo(empr: EmpresaModelo) {

        return this.http.post(this.url + '/insertar', empr).pipe(
          tap(result => {
          }),
          catchError(this.handleError('registrando datos', []))
        );
    }
    
    actualizar(empr: EmpresaModelo) {        
        const url = `${this.url}/actualizar/${empr.IdGenEmpresa}`;
    
        return this.http.put(url,empr).pipe(
          tap(result => {
          }),
          catchError(this.handleError('actualizando registro', []))
        );
    }
    
    eliminar(empr: EmpresaModelo){    
        const url = `${this.url}/eliminar/${empr.IdGenEmpresa}`;
        
        return this.http.delete(url).pipe(
          tap(result => {
          }),
          catchError(this.handleError('error eliminando registro', []))
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