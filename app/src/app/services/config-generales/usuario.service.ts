import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../../models/user';
import {Icorreos} from '../../models/config-generales/Icorreos';
import {Idirecciones} from '../../models/config-generales/Idirecciones';
import {Itelefonos} from '../../models/config-generales/Itelefonos';
import { estadosDetalle } from 'src/app/models/solped-detalle';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url: string;
  user: User={};
  usuarios: User[];  

  constructor(private http: HttpClient) { 
    this.url = environment.usuariosUrl;
  }


  consultarTodos(): Observable<User[]> {
    
    return this.http.get<User[]>(this.url + 'consultar')
      .pipe(
        tap(result => this.log(`fetched Usuarios`)),
        catchError(this.handleError('consultarTodos', []))
      );
  }

  direcciones(idUser: number): Observable<Idirecciones[]> { 
    const url = `${this.url}direcciones/${idUser}`;   
    return this.http.get<Idirecciones[]>(url)
      .pipe(
        tap(result => this.log(`fetched direcciones`)),
        catchError(this.handleError('direcciones', []))
      );
  }
  
  correos(idUser: number): Observable<Icorreos[]> { 
    const url = `${this.url}correos/${idUser}`;   
    return this.http.get<Icorreos[]>(url)
      .pipe(
        tap(result => this.log(`fetched correos`)),
        catchError(this.handleError('correos', []))
      );
  }

  telefonos(idUser: number): Observable<Itelefonos[]> { 
    const url = `${this.url}telefonos/${idUser}`;   
    return this.http.get<Itelefonos[]>(url)
      .pipe(
        tap(result => this.log(`fetched telefonos`)),
        catchError(this.handleError('telefonos', []))
      );
  }

  consultarPorCargo(_idcargo: number): Observable<User[]> {
    const usuario = {
      idSegUsuario: null,
      primerNombre: null,
      segundoNombre: null,
      primerApellido: null,
      segundoApellido: null,       
      usuario: null,      
      estatus: null ,      
      idConfigCargo: _idcargo       
  }

    return this.viewFromAnyField(usuario);
  }

  viewFromAnyField(buscar: User): Observable<User[]> {
    let _id: any;
    let nombre1= buscar.primerNombre;
    let nombre2=buscar.segundoNombre;
    let apellido1=buscar.primerApellido
    let apellido2=buscar.segundoApellido
    let login=buscar.usuario;
    let estatus: any;
    let idCargo: any;
    
    if (buscar.idSegUsuario==null){
      _id="NULL";
    }else {
      _id=buscar.idSegUsuario.toString();
    }
    if (buscar.primerNombre==null){
      nombre1="NULL";
    }
    if (buscar.segundoNombre==null){
      nombre2="NULL";
    }
    if (buscar.primerApellido==null){
      apellido1="NULL";
    }
    if (buscar.segundoApellido==null){
      apellido2="NULL";
    }
    if (buscar.usuario==null){
      login="NULL";
    }
    if (buscar.estatus==null){
      estatus="NULL";
    }else{
      estatus= buscar.estatus.toString();
    }
    if (buscar.idConfigCargo==null){
      idCargo="NULL";
    }else{
      idCargo=buscar.idConfigCargo.toString();
    }

    const url = `${this.url}filtrar/${_id}/${nombre1}/${nombre2}/${apellido1}/${apellido2}/${login}/${estatus}/${idCargo}`;

    return this.http.get<User[]>(url)
      .pipe(
        tap(result => this.log(`fetched Usuarios`)),
        catchError(this.handleError('viewFromAnyField', []))
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
