import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs-compat';



@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        //let testUser = { id: 1, username: 'lalbornoz', password: '1234', firstName: 'Luis', lastName: 'Albornoz' };

        let testUser = JSON.parse(sessionStorage.getItem('currentUser'));

        console.log('fake-backend');
        if(!testUser)
            console.log('testUser en blanco');
        

        // wrap in delayed observable to simulate server api call
        return Observable.of(null).mergeMap(() => {

            // authenticate
            console.log(request.url);
            if (request.url.endsWith('/api/login') && request.method === 'POST') {
                

                if (request.body.usuario == testUser.usuario && request.body.contrasenia == testUser.contrasenia) {
                    // if login details are valid return 200 OK with a fake jwt token
                    return Observable.of(new HttpResponse({ status: 200, body: { token: 'fake-jwt-token' } }));
                } else {
                    // else return 400 bad request
                    return Observable.throw('Username or password is incorrect');
                }
            }

            // get users
            if (request.url.endsWith('/api/usuarios') && request.method === 'GET') {
                // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return Observable.of(new HttpResponse({ status: 200, body: [testUser] }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return Observable.throw('Unauthorised');
                }
            }

            // pass through any requests not handled above
            return next.handle(request);
            
        })

        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .materialize()
        .delay(500)
        .dematerialize();
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};