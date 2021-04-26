import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";
//import {LogTransacService} from './services/logtransac.service';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})

export class HttpErrorInterceptor implements HttpInterceptor {

	/*constructor(private srvlog : LogTransacService){
	  
	}*/

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		//const clonedRequest = request.clone({ headers: request.headers.set('Access-Control-Allow-Origin', '*') });
		//const clonedRequest = request;
		//const clonedRequest = request.clone({ headers: request.headers.set('Authorization', `Bearer ${}`) });
		//request = request.clone({headers: request.headers.set('Authorization', `Bearer ${token}`) });
		return next.handle(request)
			.pipe(
				/* tap(event=>{
				  //window.alert();
				  // this.srvlog.logearTransaccion(); 
				   return event;
				 }),*/
				retry(1),
				catchError((error: HttpErrorResponse) => {
					let errorMessage = '';
					if (error.error instanceof ErrorEvent) {
						// client-side error
						errorMessage = `Error en cliente: ${error.error.message}`;
					} else {
						// server-side error
						errorMessage = `Error en Servidor: ${error.status}\nMessage: ${error.message}`;
					}
					window.alert(errorMessage);
					return throwError(errorMessage);
				})
			)
	}
}