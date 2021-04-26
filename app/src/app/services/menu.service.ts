import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { of } from "rxjs";
import { User, MenuUsuario, MenuTreeTable, BreadCrumb, Menu } from '../models/index'
import { SelectItem } from 'primeng/api';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private url: string;
  private user: User;

  constructor(private http: HttpClient, private router: Router) {
    this.url = environment.apiUrl + 'menus';
  }


  getMenuUserById(id: number): Observable<MenuUsuario[]> {
    const url = `${this.url}/obtenerMenuUsuario/${id}`;

    return this.http.get<MenuUsuario[]>(url)
      .pipe(
        tap(result => this.log(`fetched MenuUser`)),
        catchError(this.handleError('getMenuUserById', []))
      );
  }

  getMenuUserByIdP(id: number): Promise<MenuUsuario[]> {
    const url = `${this.url}/obtenerMenuUsuario/${id}`;

    return this.http.get<MenuUsuario[]>(url).toPromise();
  }

  getMenu(): Observable<MenuTreeTable[]> {
    const url = `${this.url}`;

    return this.http.get<MenuTreeTable[]>(url)
      .pipe(
        tap(result => this.log(`fetched MenuUser`)),
        catchError(this.handleError('getMenu', []))
      );
  }

  getMenuById(id: number): Observable<Menu>{

    const url = `${this.url}/${id}`;

    return this.http.get(url)
      .pipe(
        catchError(this.handleError('getMenuById'))
      );
  }

  getMenuItems(): Observable<SelectItem[]> {
    const url = `${this.url}/items`;

    return this.http.get<SelectItem[]>(url)
      .pipe(
        tap(result => this.log(`fetched MenuUser`)),
        catchError(this.handleError('getMenuUserById', []))
      );
  }


  getMenuIcons(): Observable<SelectItem[]> {
    const url = `${this.url}/icons`;

    return this.http.get<SelectItem[]>(url)
      .pipe(
        tap(result => this.log(`fetched MenuUser`)),
        catchError(this.handleError('getMenuUserById', []))
      );
  }

  getRouters(): SelectItem[] {

    let items = new Array<SelectItem>();
    let item: SelectItem;
    this.router.config.forEach((item, index) => {

      switch (item.path) {

        case "**": {
          //statements; 
          break;
        }
        case "": {
          //statements; 
          break;
        }
        case "login": {
          //statements; 
          break;
        }
        case "logout": {
          //statements; 
          break;
        }
        default: {
          //statements; 
          items.push({ label: item.path, value: item.path, icon: "pi pi-lock-open" });
          break;
        }
      }

      if (item.children) {
        item.children.forEach((item2, index2) => {
          items.push({ label: item2.path, value: item2.path, icon: "pi pi-lock-open" });

        });
      }
    });
    return items;
  }

  getBreadCrumb(id: number): Observable<BreadCrumb[]> {

    const url = `${this.url}/obtenerBreadCrumb/${id}`;

    return this.http.get<BreadCrumb[]>(url)
      .pipe(
        tap(result => this.log(`fetched BreadCrumb`)),
        catchError(this.handleError('getBreadCrumb', []))
      );
  }

  nuevoItemMenu(itemMenu: Menu): Observable<Menu> {
    const url = `${this.url}`;

    return this.http.post<Menu>(url, itemMenu)
      .pipe(
        catchError(this.handleError('nuevoItemMenu', itemMenu))
      );
  }

  actualizarItemMenu(itemMenu: Menu) {
    
    const url = `${this.url}/` + itemMenu.idSegMenu;

    return this.http.put<Menu>(url, itemMenu)
      .pipe(
        catchError(this.handleError('nuevoItemMenu', itemMenu))
      );
  }

  


  eliminarItemMenu(id: number){
    
    const url = `${this.url}/` + id;

    return this.http.delete(url).pipe(
      tap(result => {
      }),
      catchError(this.handleError('setRol', []))
    );
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
