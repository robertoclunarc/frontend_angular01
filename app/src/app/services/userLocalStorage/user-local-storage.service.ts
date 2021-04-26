import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";
import { RolModelo } from '../../models/rol';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserLocalStorageService {

  private url: string;
  private roles: RolModelo[] = [];

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'userLocalStorage';
  }

  setRolesLocalStorage(roles: RolModelo[]) {
    this.deleteRolesLocalStorage();
    try {
      localStorage.setItem("roles", JSON.stringify(roles));

    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  private deleteRolesLocalStorage() {
    if (localStorage.getItem("roles"))
      localStorage.removeItem("roles");
  }

  public getRoles(id: number): Observable<RolModelo[]> {
    const url = `${this.url}/obtenerRoles/${id}`;

    return this.http.get<RolModelo[]>(url)
      .pipe(
        tap(result => this.log(`fetched MenuUser`)),
        catchError(this.handleError('getRoles', []))
      );
  }

  public buscarRolPorCodigo(codigo: string): RolModelo[] {


    this.roles = JSON.parse(localStorage.getItem("roles"));
    let result = this.roles.filter(e => e.codigo.indexOf(codigo) >= 0);
    return result;
  }

  public buscarRolPorId(id: number): RolModelo[] {

    this.roles = JSON.parse(localStorage.getItem("roles"));
    let result = this.roles.filter(e => e.idSegRol == id);
    return result;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  private log(message: string) {
    //console.log('UserService: ' + message);
  }

}
