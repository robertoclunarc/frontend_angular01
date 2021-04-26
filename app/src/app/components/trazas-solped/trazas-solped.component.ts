import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TrazaSolpedService } from 'src/app/services/traza-solped.service';
import { TrazasSolped } from 'src/app/models/trazas-solped';
import { from } from 'rxjs';

@Component({
	selector: 'app-trazas-solped',
	templateUrl: './trazas-solped.component.html',
	styleUrls: ['./trazas-solped.component.scss']
})
export class TrazasSolpedComponent implements OnInit, OnDestroy {

	@Input() idSolpedCompras: number = -1;
	trazasSolped: TrazasSolped[] = []

	cols: any[];

	constructor(private svrTrazas: TrazaSolpedService) { }

	ngOnInit() {

		this.cols = [
			{ field: 'idTrazaSolped', header: 'ID', width: "5%" },
			{ field: 'fechaAlta', header: 'Fecha', width: "15%" },
			{ field: 'justificacion', header: 'Justificación', width: "50%" },
			{ field: 'estadoAnterior', header: 'Estatus', width: "10%" }
		];


		//const obsTraza = from(this.svrTrazas.getAllSolped(this.idSolpedCompras));
/* 
		this.svrTrazas.getAllSolped(this.idSolpedCompras)
			.then((result) => {
				this.trazasSolped = result;

			});
 */
			this.svrTrazas.trazas$.subscribe((data) => {
				this.trazasSolped = data;
			})
			
	}

	ngOnDestroy(){
		
	}
	

}
