import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EmpresaCompras } from '../../models/empresa-compras';


@Injectable({
    providedIn: 'root'
  })
  export class EmpresacomprasService {
    private url: string;
    comEmp: EmpresaCompras={};
    EmpresasCompras: EmpresaCompras[];    
  
    constructor(private http: HttpClient) { 
      this.url = environment.comprasUrl + 'empresas';
    }

    getTodos() {
		const empresa: EmpresaCompras = {
            IdComprasEmpresa: null,
            nombre_empresa: null,
            rif: null,
            base_de_datos: null,
            direccion_fiscal: null,
            cerrada: null
        }
		return this.viewFromAnyField(empresa).toPromise();
	}

    getAllconCerradas(c: number) {
		const empresa: EmpresaCompras = {
            IdComprasEmpresa: null,
            nombre_empresa: null,
            rif: null,
            base_de_datos: null,
            direccion_fiscal: null,
            cerrada: c
        }
		return this.viewFromAnyField(empresa).toPromise();
	}

    getTodosPorGerencia(idGerencia: number, idArea: number) {
		return this.http.get<EmpresaCompras[]>(this.url + "/empresacomprasgerencia/" + idGerencia + "/" + idArea).toPromise()
			.then(data => { return data })
			.catch();
	}

    getDetalleEmpresaCompras(idGenEmpresa: number) {
		const empresa: EmpresaCompras = {
            IdComprasEmpresa: idGenEmpresa,
            nombre_empresa: null,
            rif: null,
            base_de_datos: null,
            direccion_fiscal: null,
            cerrada: null
        }
		return this.viewFromAnyField(empresa).pipe(
            tap(result => console.log(`Resultado DetalleEmpresa Exitoso`)),
            catchError(this.handleError('getDetallePefil ', []))
        );
	}

    getDetalleEmpresaComprasP(idGenEmpresa: number): Promise<EmpresaCompras> {
        const empresa: EmpresaCompras = {
            IdComprasEmpresa: idGenEmpresa,
            nombre_empresa: null,
            rif: null,
            base_de_datos: null,
            direccion_fiscal: null,
            cerrada: null
        }
		return this.viewFromAnyField(empresa).toPromise()
        .then(data => { return data[0]; })
        .catch();
	}

    viewFromAnyField(empresa: EmpresaCompras): Observable<EmpresaCompras[]> {
             
        let _cerrada=empresa.cerrada
        let _id=empresa.IdComprasEmpresa;
        let _nombre = empresa.nombre_empresa;
        let _rif = empresa.rif; 
        let _bd = empresa.base_de_datos;
        let _dirFis = empresa.direccion_fiscal;               
    
        const url = `${this.url}/filtrar/${_id}/${_nombre}/${_rif}/${_bd}/${_dirFis}/${_cerrada}`;
    
        return this.http.get<EmpresaCompras[]>(url)
          .pipe(
            tap(result => this.log(`fetched Activo`)),
            catchError(this.handleError('viewFromAnyField', []))
          );
    }

    nuevoEmpresaCompras(Empresa: EmpresaCompras) {
		
		return this.http.post(this.url + '/insertar', Empresa).toPromise()
			.then(data => { return data; })
			.catch()
	}


	actualizarEmpresaCompras(Empresa: EmpresaCompras) {
		
		return this.http.put<EmpresaCompras>(this.url + "/actualizar/" + Empresa.IdComprasEmpresa, Empresa).toPromise()
			.then(data => { return data; })
			.catch();
	}

	eliminarEmpresaCompras(Empresa: EmpresaCompras) {

		
		return this.http.delete(this.url + "/eliminar/" + Empresa.IdComprasEmpresa).toPromise()
			.then(data => { return data; })
			.catch();
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