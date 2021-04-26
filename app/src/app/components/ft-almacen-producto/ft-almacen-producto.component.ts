import { Component, OnInit, Input } from '@angular/core';
import *  as  data from '../../../app/data.json';
import { SelectItem, TreeNode } from 'primeng/api';
import { FtAlmacenProductoService } from '../../services/ft-almacen-producto.service'
import { ProductosService } from '../../services/productos.service';
import { Producto } from 'src/app/models/producto';
import { AlmacenesService } from '../../services/almacenes.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Almacenes } from 'src/app/models/almacenes';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';


@Component({
	selector: 'app-ft-almacen-producto',
	templateUrl: './ft-almacen-producto.component.html',
	styleUrls: ['./ft-almacen-producto.component.scss'],
	providers: [FtAlmacenProductoService, ProductosService, AlmacenesService, MessageService, ConfirmationService]
})
export class FtAlmacenProductoComponent implements OnInit {

	@Input('producto') producto: Producto;
	@Input() puedeEditar: boolean;

	files: TreeNode[];
	selectedFile: TreeNode;
	file: any = (data as any).default;
	pyfile: any;
	filesTree: TreeNode[] = [];
	selectedNode: TreeNode;
	selectedNodes: TreeNode[] = [];
	//canSelect: string;
	//canEdit: any;
	//puesto: TreeNode = {};
	//idProducto: any;
	nodo: TreeNode = {};
	//idPuestoProducto: any;
	//dataParaComparar: TreeNode = {};
	nombreAprodProd = "ROL-APRO-CATA";                    /* Rol Aprobacion de la info del prodcuto  */
	estilo: string;
	//forMaping: TreeNode[];

	selectedFiles: TreeNode[];
	preselectednode: TreeNode = {}
	preselected: TreeNode[] = [];

	infoProducto: Producto = {};
	label: string;
	almacen: Almacenes;
	preselectedNodes: TreeNode[];
	dataNodo: Almacenes;
	rolEdicion: boolean;
	rolAprobacionProd: boolean;
	accesorios: SelectItem[];

	verInfUser: boolean = true;

	constructor(private AlmacenProductoService: FtAlmacenProductoService,
		private messageService: MessageService,
		private confirmationService: ConfirmationService,
		private srvProducto: ProductosService,
		private servicioAlmacen: AlmacenesService,
		private actRouter: ActivatedRoute,) { }

	ngOnInit() {
		let rolProducto = (this.actRouter.snapshot.params.rol == "true") ? true : false;
		this.rolEdicion = rolProducto;
		this.rolAprobacionProd = ((JSON.parse(localStorage.getItem('roles')).find(rol => rol.codigo == this.nombreAprodProd)) != null ? false : true);

		this.accesorios = [
			{ label: 'No', value: '0' },
			{ label: 'Si', value: '1' }
		];
		console.log("producto: ", this.producto.codigo)
		this.setArbol();
	}

	setArbol() {
		this.AlmacenProductoService.tree()
			.then((resp) => {
				this.pyfile = <TreeNode[]>resp;
				console.log(this.pyfile)
				this.filesTree = [{
					label: 'Almacenes',
					children: this.pyfile.data,
					expandedIcon: 'fas fa-warehouse',
					collapsedIcon: 'fas fa-warehouse',
					expanded: false,
				}]
				//this.forMaping = this.filesTree;
				this.forMaping(this.filesTree);
			});
	}

	forMaping(filesTree: TreeNode[]) {
		this.preselected = filesTree;
		this.preselected.map((nodo) => {
			//console.log('cada nodo;',nodo);
			nodo.children && this.forMaping(nodo.children);
			this.dataNodo = nodo.data;
		
			if (this.dataNodo.codigoProducto && nodo.leaf == true) {
				nodo.label = "OCUPADO";
				nodo.collapsedIcon = "fas fa-lock";
				nodo.expanded = false;

			} if (this.dataNodo.codigoProducto === this.producto.codigo) {
				nodo.label = this.producto.nombre;
				nodo.expanded = false;
				nodo.collapsedIcon = "fas fa-map-marker-alt";
				this.selectedFile = nodo;
				this.selectedNodes.push(nodo);
				this.preselectedNodes = this.selectedNodes;
			}
		});
	}


	nodeSelect(evt: any): void {
		this.nodo = evt.node;
		console.log('selecciona el nodo', evt);
		if (this.puedeEditar === false) {

			if (!this.nodo.children && this.nodo.data.codigoProducto === null) {
				console.log(this.preselectedNodes)
				console.log(this.nodo)
				this.agregarProductoEnALmacen(this.nodo.data);
			} else {
				this.ValidarNodoBorrar(this.nodo)

			}

		} else {
			if (this.nodo.data.codigoProducto != null) {
				this.MuestraProductoEnAlmacen(evt.node);
			}

		}
	}

	ValidarNodoBorrar(nodo: TreeNode) {
		this.preselectedNodes.forEach(file => {
			if (file.data.codigoProducto == nodo.data.codigoProducto) {

				this.eliminarProductodeAlmacen(this.nodo.data);
			} else {

				return null
			}

		});

	}

	agregarProductoEnALmacen(dataNodo: Almacenes) {
		this.almacen = dataNodo;
		this.almacen.codigoProducto = this.producto.codigo;
		this.confirmationService.confirm({
			message: "¿Desea asignar este puesto al producto?",
			accept: () => {
				//dataNodo.codigoProducto = this.producto.codigo;
				//window.alert('estso es lo que se esta enviando,'+ dataNodo.idAlmacenes + dataNodo.codigoProducto);
				console.log('esto envio', this.almacen);
				this.AlmacenProductoService.addProducto(this.almacen).then(
					result => {
						console.log(result);
						this.setArbol();
						//this.preselectednode = {};
						//this.selectedFiles.push(this.nodo);
						//this.dataparaflask = {};
						this.almacen = {};
						this.messageService.clear();
						this.messageService.add({ key: 'tc', severity: 'success', summary: 'NUEVO PUESTO ASIGANDO AL PRODUCTO' })
					}
				);
			},
			reject: () => { }
		});
	}



	eliminarProductodeAlmacen(dataNodo: Almacenes) {
		this.almacen = dataNodo;


		this.confirmationService.confirm({
			message: "¿Desea eliminar este producto del Almacen?",
			accept: () => {

				this.almacen.codigoProducto = null;
				this.AlmacenProductoService.addProducto(this.almacen).then(
					result => {

						this.almacen = {};
						this.setArbol();
						this.messageService.clear();
						this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Relacion Puesto Producto eliminada' })
					});
			}
		});

	}
	MuestraProductoEnAlmacen(node) {
		this.messageService.clear();
		this.messageService.add({ key: 'tc', severity: 'info', summary: 'Codigo de producto asociado', detail: `${node.data.codigoProducto}`, closable: true, sticky: false });
		//console.log('data del producto por id', this.infoProducto[0]);
	}

	guardarDatosAlmacen() {
		this.confirmationService.confirm(
			{
				message: "Se actualizara solo la información del almacen de este producto. ¿Desea continuar?",
				accept: async () => {
					this.producto.aprobadoAlmacen = 0;
					this.producto.ultimaModAlmacen = formatDate(new Date(), "yyyy-MM-dd", "en-US");
					this.producto.idUsuarioModAlmacen = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
					await this.srvProducto.actualizarSoloDataAlamcen(this.producto, 2).toPromise();

					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'info', summary: 'Actualización Realizada!' })
				}
			});

	}

	aprobarDataAlmacen() {
		this.confirmationService.confirm(
			{
				message: "¿Desea aprobar la información de almacen?",
				accept: async () => {
					this.producto.aprobadoAlmacen = 1;
					this.producto.idUsuarioAprobAlmacen = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
					this.producto.fechaAproboAlmacen = formatDate(new Date(), "yyyy-MM-dd", "en-US");
					await this.srvProducto.actualizarAprobarAlamcen(this.producto, 2).toPromise();

					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'info', summary: 'Actualización Realizada!' })
				}
			});
	}

	/* consultarNombredeProducto(dataNodo: Almacenes) {

		this.AlmacenProductoService.consultarProductoporId(dataNodo.codigo)
			.then(response => {
			this.infoProducto = response;

				this.messageService.clear();
				this.messageService.add({ key: 'c', severity: 'info', summary: 'Detalles', detail: `${this.infoProducto[0].nombre}`, data: [`${dataNodo.data[2]}`, `${this.infoProducto[0].codigo}`], closable: true, sticky: true });
				console.log('data del producto por id', this.infoProducto[0]);

				return this.infoProducto
			});


	} */
}
