import { Activo } from './../../models/activo';
import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from 'src/app/models/producto';

@Component({
	selector: 'app-solalmacen',
	templateUrl: './solalmacen.component.html',
	styleUrls: ['./solalmacen.component.scss']
})
export class SolalmacenComponent implements OnInit {

	productos: Producto[] = [];
	activos: Activo[] = [];
	activoSelected: Activo = {};
	productoSelected: Producto = {};

	solicitud : Producto[] = [];

	cols: any[];


	constructor(
		private srvProductos: ProductosService
	) { }

	ngOnInit(): void {
		this.cols = [
			{ field: 'id', header: 'Codigo' },
			{ field: 'descripcion', header: 'Descripcion' },
			{ field: 'cantidad', header: 'Cant.' },
		];
	}

	buscarDatosProductosNombre(e) {

		let json = { 'campo1': 'nombre' };

		this.srvProductos.busquedaPorCamposJSONFrase(json, e.query)
			.toPromise()
			.then(results => { this.productos = results; })
			.catch(err => { console.log(err) });
	}

	cargarDatosSol() {
		this.solicitud.push({});
	}


}
