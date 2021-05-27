import { ProveedorModelo } from 'src/app/models/proveedor-modelo';
import { ProveedoresComprasService } from 'src/app/services/proveedores-compras.service';
import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
	selector: 'app-proveedores-list',
	templateUrl: './proveedores-list.component.html',
	styleUrls: ['./proveedores-list.component.scss'],
	providers: [MessageService, ConfirmationService]

})
export class ProveedoresListComponent implements OnInit {

	proveedores: ProveedorModelo[] = [];
	cols: any[] = [];
	displayForm: boolean = false;
	proveeSelected : ProveedorModelo = {};

	constructor(private srvProveedores: ProveedoresComprasService,
		private messageService: MessageService, private confirmationService: ConfirmationService) { }


	async ngOnInit() {
		this.proveedores = [... await this.srvProveedores.obtenerTodos().toPromise()];
		// Sconsole.log(this.proveedores);

		this.cols = [
			{ field: 'idProveedor', header: 'id', witdh: "10%" },
			{ field: 'nombre', header: 'Nombre', witdh: "20%" },
			{ field: 'rif', header: 'RIF', witdh: "10%" },
			{ field: 'direccion', header: 'Direccion', witdh: "25%" },
			{ field: 'contacto', header: 'Contacto', witdh: "10%" },
		];
	}

	editar(provee: ProveedorModelo) {
		// console.log(provee);
		this.displayForm = true;
		this.proveeSelected = {... provee};
	}

	eliminar(provee: ProveedorModelo, indice: number) {
		console.log(provee, indice);
	}

}
