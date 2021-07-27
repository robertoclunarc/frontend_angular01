import { Observable } from 'rxjs';
import { TrazasocService } from './../../services/trazasoc.service';
import { Component, Input, OnInit } from '@angular/core';
import { TrazaOc } from 'src/app/models/traza-oc';

@Component({
	selector: 'app-trazas-oc-list',
	templateUrl: './trazas-oc-list.component.html',
	styleUrls: ['./trazas-oc-list.component.scss']
})
export class TrazasOcListComponent implements OnInit {

	@Input() idComprasOC: number;
	trazasOC: Observable<TrazaOc[]>;
	cols: any[] = [];

	constructor(private svrTrazas: TrazasocService) { }

	ngOnInit(): void {
		console.log("id llegado:", this.idComprasOC);

		this.cols = [
			{ field: 'idTrazaOC', header: 'id', width: "5%" },
			{ field: 'fechaAlta', header: 'Fecha', width: "15%" },
			{ field: 'justificacion', header: 'Justificación', width: "50%" },
			{ field: 'estadoAnterior', header: 'Estatus', width: "10%" }
		];

		this.cargarLista();
	}

	cargarLista() {
		this.trazasOC = this.svrTrazas.getAllTrazas(this.idComprasOC);
		console.log("trazas: ", this.trazasOC);
	}

}
