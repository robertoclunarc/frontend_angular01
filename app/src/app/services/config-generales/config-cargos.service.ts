import { User } from '../../models/user';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { CargosModelo } from '../../models/cargos';
import { environment } from '../../../../src/environments/environment'

@Injectable({
	providedIn: 'root'
})
export class CargosService {

	URL_api: string = environment.configUrl + "cargos/";
    URL_api_user: string = environment.usuariosUrl;

	constructor(private http: HttpClient) { }

	getTodos(): Observable<CargosModelo[]> {
		return this.http.get<CargosModelo[]>(this.URL_api + "consultar")
			.pipe(
				tap(result => console.log(`Resultado cargos Exitoso`)),
				catchError(this.handleError('getTodoscargo ', []))
			);
	}

    viewFromAnyField(cargo: CargosModelo): Observable<CargosModelo[]> {
        let _id: any;
        let _nombre = cargo.nombre;
        let _desc = cargo.descripcion;        
        let _idGcia: any
        
        if (cargo.idConfigCargo==null){
          _id="NULL";
        }else {
          _id=cargo.idConfigCargo.toString();
        }
        if (cargo.nombre==null){
          _nombre="NULL";
        }
        if (cargo.descripcion==null){
          _desc="NULL";
        }
        if (cargo.idConfigGerencia==null){
          _idGcia="NULL";
        } else{
            _idGcia=cargo.idConfigGerencia.toString();
        }      
    
        const url = `${this.URL_api}filtrar/${_id}/${_nombre}/${_desc}/${_idGcia}`;
    
        return this.http.get<CargosModelo[]>(url)
          .pipe(
            tap(result => this.log(`fetched Cargos`)),
            catchError(this.handleError('viewFromAnyField', []))
          );
      }

	getDetallecargo(idConfigCargo: number) {
        const cargo: CargosModelo = {
            idConfigCargo: idConfigCargo,
            nombre: null,
            descripcion: null,
            idConfigGerencia: null
        }
		return this.viewFromAnyField(cargo);
	}

	getDetallecargoP(idConfigCargo: number) {
		const cargo: CargosModelo = {
            idConfigCargo: idConfigCargo,
            nombre: null,
            descripcion: null,
            idConfigGerencia: null
        }
		return this.viewFromAnyField(cargo).toPromise();
	}

	nuevocargo(cargo: CargosModelo) {
		return this.http.post(this.URL_api + "insertar", cargo).pipe(
			tap(result => {
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));				
			}),
			catchError(this.handleError('setcargo', []))
		);
	}


	actualizarcargo(cargo: CargosModelo) {		
		return this.http.put(this.URL_api + "actualizar" + cargo.idConfigCargo, cargo).pipe(
			tap(result => {
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));				
			}),
			catchError(this.handleError('setcargo', []))
		);
	}

	eliminarcargo(cargo: CargosModelo) {

		return this.http.delete(this.URL_api + "eliminar" + cargo.idConfigCargo).pipe(
			tap(result => {
				console.log('cargo Eliminado');
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));				
			}),
			catchError(this.handleError('setcargo', []))
		);
	}

	async persona_cargo(idGerencia: number, desCargo: string) {        
        const cargo: CargosModelo = {
            idConfigCargo: null,
            nombre: desCargo,
            descripcion: null,
            idConfigGerencia: idGerencia
        }

        let user: User[]=[];
        let cargos: CargosModelo[]=[];
        let nombresCompletosUser: string[]=[];
        
        await  this.viewFromAnyField(cargo)
          .toPromise()     
          .then(result => {
            cargos= result;                    
            cargos.forEach(c => {                
                this.usuarios(c.idConfigCargo)
                .toPromise()
                .then(results => {user=results;                  
                        user.forEach(u => {                            
                            if (u.nombre_completo!=null && u.nombre_completo!=undefined && u.nombre_completo!=""){
                              nombresCompletosUser.push(u.nombre_completo)
                            }
                        });
                    }),
                    catchError(this.handleError('consultando usuarios', []))                               
            });            
          })
          .catch(err => { console.log('error garrafal') });
          return nombresCompletosUser;
	}

  private usuarios(_idCargo): Observable<User[]> {
    const url=this.URL_api_user +  "filtrar/NULL/NULL/NULL/NULL/NULL/NULL/NULL/" + _idCargo;
		return this.http.get<User[]>(url)
			.pipe(
				tap(result => console.log(`Resultado usuarios por cargo`)),
				catchError(this.handleError('usuarios ', []))
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