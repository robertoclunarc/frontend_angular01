import { Component, OnInit } from '@angular/core';
import { AlmacenesService } from '../../services/almacenes.service';
import { TreeNode, rowNode } from '../../models/treenode';
import { SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { Almacenes } from '../../models/almacenes';
import { SelectedNode } from '../../models/almacen';


@Component({
	selector: 'app-adm-almacenes',
	templateUrl: './adm-almacenes.component.html',
	styleUrls: ['./adm-almacenes.component.scss'],
	providers: [AlmacenesService, MessageService, ConfirmationService],

})
export class AdmAlmacenesComponent implements OnInit {

	cols: any[];

	//Tpuestos: Puesto[] = [];
	//UNpuesto: Puesto = {};
	almacen: Almacenes = {};
	almacenes: Almacenes[] = [];
	itemForDialog: SelectedNode;
	displayDialog: boolean;
	menuItems: SelectItem[] = [];
	parentItems: SelectItem[] = []
	tituloDialogo: string;
	editOnEvent: boolean;
	readonly: boolean;
	arbol: TreeNode[] = [];
	node: rowNode = {};
	selectedNode: rowNode;
	desabilitarCheck: boolean = true;
	//aceptaPuesto: boolean;
	levelValue: number;
	onEdit: boolean = false;

	idUsusarioSesion: number = -1;
	idGerenciaSesion: number = -1;

	constructor(private almacenesservice: AlmacenesService,
		private messageService: MessageService,
		private confirmationservice: ConfirmationService) {
		this.idUsusarioSesion = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
		this.idGerenciaSesion = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;
	}

	ngOnInit() {

		this.cols = [

			{ field: 'nombre', header: 'Nombre', width: '30%', display: 'true' },
			{ field: 'codigo', header: 'Codigo', width: '30%', display: 'true' },
			{ field: 'descripcion', header: 'Descripcion', width: '35%', display: 'true' },
			{ field: 'idPadre', header: ' ID', width: '10%', display: 'none' },
			{ field: 'idPropio', header: 'ID Parent', width: '5%', display: 'none' },
		];
		this.treenode();
		this.desabilitarCheck = true;


		//this.aceptaPuesto = true; // estas dos variables, activan y desactivan los checkbox
	}

	treenode() {
		this.almacenesservice.nodeTreeGerencia(this.idGerenciaSesion).
			then((resp) => {
				this.arbol = <TreeNode[]>resp.data;
				console.log(this.arbol);
			});
	}

	cerrarDialogo() {
		this.displayDialog = false;
	}


	setParentItems() {

		this.parentItems = [];
		this.parentItems = [
			{ label: 'Nuevo Almacen', value: '0' }
		];
		this.almacenesservice.regsitrosPorGerencia(this.idGerenciaSesion)// TodosLosRegistros()
			.then((resp) => {
				this.almacenes = resp;
				this.almacenes.forEach((registro) => {
					this.parentItems.push({ label: registro.nombre, value: registro.idAlmacenes });
				});
			});
	}

	onChangeItems(event) {
		console.log('onchage active', event);
		this.desabilitarCheck = true;
		//this.aceptaPuesto = true;

		let changedValue = event.value;
		let domEvent = event.originalEvent;

		//this.setParentItems();
		this.menuItems = [];
		this.levelValue = changedValue;
		if (this.levelValue == 0) {
			this.desabilitarCheck = false;
			//this.aceptaPuesto = true;
		} else {
			this.desabilitarCheck = true;
			//this.aceptaPuesto = false;
		}

	}

	edit(rowNode: any) {

		this.almacen = rowNode;
		console.log("Edit: ", this.almacen);

		this.readonly = true;
		this.onEdit = true;
		this.tituloDialogo = ('Editando:  ' + `${this.almacen.nombre}`);
		this.displayDialog = true;
	}


	Nuevo() {
		this.setParentItems();
		this.readonly = false;
		this.tituloDialogo = 'Nuevo';
		this.displayDialog = true;
		this.almacen = {};
		this.menuItems = [];
		this.onEdit = false;
	}

	SaveChanges(selectedItem) {
		selectedItem.idGerencia = this.idGerenciaSesion;
		if (this.onEdit === true) {
			this.modificar(selectedItem);
		} else {
			this.nuevoItem(selectedItem);
		}
	}

	nuevoItem(selectedItem: Almacenes) {
		this.almacen = selectedItem;
		this.almacenesservice.nodeNuevoRegistro(this.almacen).then(
			resp => {
				this.treenode();
				this.displayDialog = false;
				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'success', summary: 'Registro realizado con éxito.' });
				//console.log('estoy guardando un registro', resp);
			});
	}

	modificar(selectedItem: Almacenes) {
		this.almacen = selectedItem
		//console.log('para modificar', this.almacen);
		//return false;
		if (this.almacen.idPadre == 0) {
			this.desabilitarCheck = false;
		}

		this.almacenesservice.nodeUpdateRegistro(this.almacen.idAlmacenes, this.almacen).then(
			resp => {
				this.treenode();
				this.displayDialog = false;
				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'success', summary: 'Registro actualizado con éxito.' });

				//console.log('estoy MODIFICCANDO un registro', resp);
			}
		)
		this.readonly = false;
		this.onEdit = false;
	}

	remove(selectedItem, node) {
		//console.log('para borrar', selectedItem, 'nodo', node);
		this.selectedNode = node;

		if (this.selectedNode.node.children) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'warn', summary: 'No se puede eliminar; posee data relacionada' });
			this.selectedNode = {};

		} else {
			this.confirmationservice.confirm({
				message: "El registro seleccionado se eliminará",
				accept: () => {
					this.almacenesservice.nodeEliminarRegistro(selectedItem.idAlmacenes).then(
						d => {
							this.treenode();
							this.almacen = {};
						});
					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'success', summary: 'REGISTRO ELIMINADO' });
					this.treenode();
				}
			});
		}
	}
}