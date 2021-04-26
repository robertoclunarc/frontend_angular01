import { Component, OnInit, Input } from '@angular/core';
import { SolpedDetalleModelo } from 'src/app/models/solped-detalle';
import { SolPedDetalleService } from 'src/app/services/sol-ped-detalle.service';

@Component({
	selector: 'app-detalle-solped-oc',
	templateUrl: './detalle-solped-oc.component.html',
	styleUrls: ['./detalle-solped-oc.component.scss']
})

export class DetalleSolpedOcComponent implements OnInit {

	@Input() idSolpedCompras: number = -1;

	solped_detalles: SolpedDetalleModelo[] = [];

	cols: any[];

	constructor(private svrDetalle: SolPedDetalleService) { }

	ngOnInit() {
		this.svrDetalle.getDetalleDetSolpedP(this.idSolpedCompras)
			.then((result) => {
				this.solped_detalles = result;
			});
		this.cols = [
			{ field: 'codigo', header: 'Codigo', width:"10%" },
			{ field: 'descripcion', header: 'Descripción', width:"40%" },
			{ field: 'fechaRequerida', header: 'Fecha requerida', width:"10%" },
			{ field: 'cantidad', header: 'Cant', width:"5%" },	
			{ field: 'nombre_activo', header: 'Proposito', width:"25%" }
		];

	}

}
