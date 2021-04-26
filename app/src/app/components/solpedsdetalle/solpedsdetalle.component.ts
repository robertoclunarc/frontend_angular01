import { SolPedService } from 'src/app/services/sol-ped.service';

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SolpedDetalleModelo } from 'src/app/models/solped-detalle';
import { SolPedDetalleService } from 'src/app/services/sol-ped-detalle.service';
import { SolpedModelo } from 'src/app/models/solped';
import { OrdenCompra } from 'src/app/models/orden-compra';
import { detalleOcModelo } from 'src/app/models/oc-Detalle';

// interface totalE {
// 	total: number,
// 	idSolpedCompras: number
// }

@Component({
	selector: 'app-solpedsdetalle',
	templateUrl: './solpedsdetalle.component.html',
	styleUrls: ['./solpedsdetalle.component.scss'],
	providers: [SolPedDetalleService]
})
export class SolpedsdetalleComponent implements OnInit {

	@Input() idSolped: number = 0;
	@Input() dataExtra: number = 0;
	@Input() acciones: number = 0;

	@Output() addListDetalle: EventEmitter<SolpedDetalleModelo> = new EventEmitter<SolpedDetalleModelo>();
	@Output() listadoDetalle: EventEmitter<SolpedDetalleModelo[]> = new EventEmitter<SolpedDetalleModelo[]>();
	//@Output() totalActivos: EventEmitter<number> = new EventEmitter<number>();
	//@Output() totalActivos: EventEmitter<totalE> = new EventEmitter<totalE>();
	//@Output() addListDetalle: EventEmitter<EventDetalle> = new EventEmitter<EventDetalle>();

	solped: SolpedModelo = {};

	opciones: number[] = [];

	// detalles: Promise<SolpedDetalleModelo>;

	detalleSolped: SolpedDetalleModelo[] = [];
	cols: any[];

	constructor(private svrSolped: SolPedService, private svrDetalleSolped: SolPedDetalleService) { }

	ngOnInit() {
		this.cols = [
			//{ field: 'codigo', header: 'Codigo', witdh: "10%" },
			{ field: 'codigo', header: '', witdh: "1" },
			{ field: 'nombre', header: 'Nombre', witdh: "15%" },
			/* 	{ field: 'uso', header: 'Uso', witdh: "5%" }, */
			//{ field: 'fechaRequerida', header: 'Reque.', witdh: "10%" },
			{ field: 'cantidad', header: 'Cant', witdh: "5%" },
			{ field: 'nombre_activo', header: 'Proposito', witdh: "15%" }
		];

		if (this.dataExtra === 1) {
			this.cols.push(
				{ field: 'cant_encontrada', header: 'C. E.', witdh: "5%" },
				{ field: 'nombre_proveedor', header: 'Provee', witdh: "15%" },
				{ field: 'subtotal', header: 'Subtotal', witdh: "10%" }
			);
		}

		/* this.svrSolped.solped$.subscribe((actual) => {
			this.solped = { ...actual };

		}) */


		//console.log(this.idSolped);
		this.svrDetalleSolped.getDetalleDetSolpedP(this.idSolped)
			.then((data) => {
				data.map((det) => { det.opcion_aprobar = 1; return det })
				this.detalleSolped = data;
				this.listadoDetalle.next(this.detalleSolped);
				//this.totalActivos.next({ total: data.length, idSolpedCompras: this.idSolped });
			});
		// this.detalles = this.svrDetalleSolped.getDetalleDetSolpedP(this.idSolped);
		// console.log(this.detalles);
	}

	/* 	generarSolped(detSol: SolpedDetalleModelo) {
			let newOC: OrdenCompra = {};
			let newDet: detalleOcModelo = {};
		}
	
		aprobarSolpedDetallado(detalle: SolpedDetalleModelo) {
			this.generarSolped(detalle);
		}
	 */
	addToListDetalle(e, detalle: detalleOcModelo) {
		//console.log(e, detalle);
		//this.addListDetalle.next({ selected: detalle, total: this.detalleSolped.length });
		this.addListDetalle.next(detalle);
	}

}
