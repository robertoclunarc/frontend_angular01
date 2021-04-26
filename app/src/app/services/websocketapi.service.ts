import { Injectable } from '@angular/core';
import { io } from "socket.io-client";
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
	providedIn: 'root'
})

export class WebsocketapiService {
	socket: any;
	constructor() {
		this.socket = io("");
	}

	listen(eventName: String) {
		return new Observable((promesa) => {
			this.socket.on(eventName, (data) => {
				promesa.next(data);
			});
		});
	}
}
