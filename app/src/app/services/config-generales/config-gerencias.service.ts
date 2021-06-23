import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GerenciasModelo, AreaTrabajo } from '../../models';

@Injectable({
    providedIn: 'root'
  })
  export class ConfigGerenciasService {
    private url: string;
    confGer: GerenciasModelo={};
    gerencias: GerenciasModelo[];
  
    constructor(private http: HttpClient) { 
      this.url = environment.configUrl + 'gerencias';
    }

    getTodos(): Observable<GerenciasModelo[]> {
        return this.http.get<GerenciasModelo[]>(this.url + '/consultar')
          .pipe(
            tap(result => this.log(`fetched Activos`)),
            catchError(this.handleError('consultarTodos', []))
          );
      }

      getTodosSinActual(idConfigGerencia: number): Observable<GerenciasModelo[]> {
        return this.http.get<GerenciasModelo[]>(this.url + '/gerenciassinactual/' + idConfigGerencia)
          .pipe(
            tap(result => console.log(`Resultado gerenciaes Exitoso`)),
            catchError(this.handleError('getTodosgerencia ', []))
          );
      }

      getDetalleGerencia(_idConfigGerencia: number): Observable<GerenciasModelo[]> {
        const gerencia: GerenciasModelo = {
          idConfigGerencia: _idConfigGerencia, 
          nombre:null,
          descripcion: null          
        }    
        return this.viewFromAnyField(gerencia);
      } 

      viewFromAnyField(gerencia: GerenciasModelo): Observable<GerenciasModelo[]> {
        let _id: any;
        let _nombre = gerencia.nombre;
        let _desc = gerencia.descripcion;        
        
        if (gerencia.idConfigGerencia==null){
          _id="NULL";
        }else{
          _id = gerencia.idConfigGerencia.toString();
        }
        if (gerencia.nombre==null){
          _nombre="NULL";
        }
        if (gerencia.descripcion==null){
          _desc="NULL";
        }        
    
        const url = `${this.url}/filtar/${_id}/${_nombre}/${_desc}`;
    
        return this.http.get<GerenciasModelo[]>(url)
          .pipe(
            tap(result => this.log(`fetched Activo`)),
            catchError(this.handleError('viewFromAnyField', []))
          );
      }

      getAreasTrabajoGerencia(idConfigGerencia: number) : Observable<AreaTrabajo[]>{
        const url = `${this.url}/${idConfigGerencia}/areasTrabajo`;    
        return this.http.get<AreaTrabajo[]>(url)
          .pipe(
            tap(result => console.log(`Resultado areas gerencias Exitoso`)),
            catchError(this.handleError('getAreasTrabajoGerencia ', []))
          );
      }

      nuevoGerencia(gerencia: GerenciasModelo) {
        return this.http.post(this.url + '/insertar', gerencia).pipe(
          tap(result => {
          }),
          catchError(this.handleError('registrar gerencia', []))
        );
      }
    
      actualizarGerencial(gerencia: GerenciasModelo) {        
        const url = `${this.url}/actualizar/${gerencia.idConfigGerencia}`;    
        return this.http.put(url, gerencia).pipe(
          tap(result => {
          }),
          catchError(this.handleError('actualizando Gerencia', []))
        );
      }
    
      eliminarGerencia(gerencia: GerenciasModelo){    
        const url = `${this.url}/eliminar/${gerencia.idConfigGerencia}`;        
        return this.http.delete(url).pipe(
          tap(result => {
          }),
          catchError(this.handleError('error eliminando Gerencia', []))
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