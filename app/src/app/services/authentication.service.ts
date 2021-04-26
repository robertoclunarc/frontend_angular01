import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/isEmpty'

import { environment } from '../../environments/environment';



import { User } from '../models/index';
import { Md5 } from "ts-md5/dist/md5";


@Injectable()
export class AuthenticationService {

    private url : string;

    constructor(private http: HttpClient)
    {}

    login(username: string, password: string) : Observable<User> {

        this.url = environment.apiUrl +  'login';

        const md5Pass = String(Md5.hashStr(password));

        return this.http.post<User>(this.url , { usuario: username, contrasenia: md5Pass })
            .map(user => {

                if (JSON.stringify(user).length>2) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('currentUser', JSON.stringify(user[0]));
                }
                return user;
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}