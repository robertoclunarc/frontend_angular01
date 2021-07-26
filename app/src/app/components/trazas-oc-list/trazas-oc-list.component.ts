import { Observable } from 'rxjs';
import { TrazasocService } from './../../services/trazasoc.service';
import { Component, Input, OnInit } from '@angular/core';
import { TrazaOc } from 'src/app/models/traza-oc';
import { tap } from 'rxjs/operators';

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
			{ field: 'idTrazaOC', header: 'ID', width: "5%" },
			{ field: 'fechaAlta', header: 'Fecha', width: "15%" },
			{ field: 'justificacion', header: 'Justificación', width: "50%" },
			{ field: 'estadoAnterior', header: 'Estatus', width: "10%" }
		];
		this.cargarLista();
	}

	cargarLista() {
		// this.svrTrazas.getAllTrazas(this.idComprasOC).pipe(
		// 	tap((trazas) => this.trazasOC = trazas)
		// ).subscribe();
		// this.svrTrazas.getAllTrazas(this.idComprasOC).subscribe((data) => this.trazasOC = data);
		this.trazasOC = this.svrTrazas.getAllTrazas(this.idComprasOC);
		console.log("trazas: ", this.trazasOC);

	}

}
