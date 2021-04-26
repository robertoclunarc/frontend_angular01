import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";
import { RespuestaModelo } from '../models/respuesta-modelo';

@Injectable({
  providedIn: 'root'
})
export class RespuestaService {

  private API_URL = environment.apiUrl + "respuestas";
  private API_URL_servicio = environment.apiUrl + "respuestasserv";

  constructor(private http: HttpClient) { }


  getTodas(idRefServicio: number): Promise<RespuestaModelo[]>{
    return this.http.get<RespuestaModelo[]>(this.API_URL).toPromise();
  }

  getTodasServicio(idRefServicio: number): Promise<RespuestaModelo[]>{
    return this.http.get<RespuestaModelo[]>(this.API_URL_servicio + "/" + idRefServicio).toPromise();
  }

  guardarRespuesta(respuesta : RespuestaModelo){
      return this.http.post(this.API_URL, respuesta).toPromise(); 
  }

}
