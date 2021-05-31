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
	proveeSelected: ProveedorModelo = {};
	displayTitle: string = "Proveedor - ";

	constructor(private srvProveedores: ProveedoresComprasService,
		private messageService: MessageService, private confirmationService: ConfirmationService) { }


	async ngOnInit() {
		// Sconsole.log(this.proveedores);
		this.cargarLista();
		this.cols = [
			{ field: 'idProveedor', header: 'Nro.', witdh: "10%" },
			{ field: 'nombre', header: 'Nombre', witdh: "20%" },
			{ field: 'rif', header: 'RIF', witdh: "10%" },
			{ field: 'direccion', header: 'Direccion', witdh: "25%" },
			{ field: 'contacto', header: 'Rubros', witdh: "15%" },
		];
	}

	async cargarLista() {
		this.proveedores = [... await this.srvProveedores.obtenerTodos().toPromise()];
	}

	editar(provee: ProveedorModelo) {
		// console.log(provee);
		this.displayForm = true;
		this.proveeSelected = { ...provee };
	}

	eliminar(provee: ProveedorModelo, indice: number) {
		// console.log(provee, indice);
		this.confirmationService.confirm({
			message: "¿Desea ELIMINAR el registro?",
			accept: async () => { 
				await this.srvProveedores.delete(provee.idProveedor).toPromise();
				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'success', summary: 'Proveedor eliminado correctamente' });
				this.cargarLista();
			}
		});

	}

	nuevoProveedor() {
		this.displayForm = true;
		this.proveeSelected = {};
	}

	registroProcesado(mensaje) {
		if (mensaje === "registrado") {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'success', summary: 'Proveedor registrado correctamente' });
			this.displayForm = false;
			this.proveeSelected = {};
			this.cargarLista();
		}
	}

}
