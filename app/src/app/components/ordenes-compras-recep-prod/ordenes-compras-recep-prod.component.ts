import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrdenCompra } from '../../models/ordenes-det-oc';
import { OrdenCompraService } from '../../services/orden-compra.service';
//import { EmpresacomprasService } from '../../services/empresacompras.service'
//import { GerenciasService } from '../../services/gerencias.service';////////////////////actualizar servicion con los api de configuraciones/
import { ProveedoresComprasService} from '../../services/proveedores-compras.service'
//import { EmpresaModelo } from '../../models/empresa';
import { ProveedorModelo } from '../../models/proveedor-modelo';
//import { ConfigGerencias } from '../../models/config-gerencias';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ordenes-compras-recep-prod',
  templateUrl: './ordenes-compras-recep-prod.component.html',
  styleUrls: ['./ordenes-compras-recep-prod.component.scss'],
  providers: [OrdenCompraService, ConfirmationService, MessageService]
})
export class OrdenesComprasRecepProdComponent implements OnInit {

  rolAsignarOC = 'ROL-ASIG-OC';
  displayDialog: boolean;	
	tituloDialogo: string = "";
  idGerencia: number = -1;
	idUsuario: number = -1;	
	verAsignar: boolean = false;
  ordenesCompras: OrdenCompra[]=[];
  ordencompra: OrdenCompra = {};
  primera_fila = 0;
  cols: any[];
  proveedor: ProveedorModelo={};
  Proveedores: ProveedorModelo[]=[];

  constructor(private svrOc: OrdenCompraService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private srvProveedor: ProveedoresComprasService,
    private router: Router,) { }

  ngOnInit(): void {
    this.idGerencia = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;
		this.idUsuario = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
		this.verAsignar = ((JSON.parse(localStorage.getItem('roles')).find(rol => rol.codigo == this.rolAsignarOC)) != null ? true : false);

    this.cols = [
			{ field: 'idComprasOC', header: 'Nro. OC', width: '10%' },
			{ field: 'fechaAlta', header: 'Fecha', width: '10%' },
		//	{ field: 'rifEmpresaProv', header: 'Rif Proveedor', width: '25%' },
      { field: 'nombreProveedor', header: 'Proveedor', width: '20%' },
		//	{ field: 'nombreEmpresa', header: 'Empresa', width: '15%' },
    //  { field: 'nombre_gerencia', header: 'Gcia. Asociadas', width: '20%' },
      { field: 'justificacion', header: 'Justificacion', width: '20%' },
    //  { field: 'login', header: 'usuario', width: '20%' }
		];
    this.llenarArrayProveedores();
    this.consultarOC();
		
  }

  consultarOC() {
		this.svrOc.getAll()
			.toPromise()
			.then(results => {         
          this.ordenesCompras = results;
          this.ordenesCompras.forEach(o => {
             o.nombreProveedor = this.Proveedores.find(p => p.idProveedor==o.idProveedor).nombre;
             
          })             
      })
			
			.catch(err => { console.log(err) });      
	}

  async llenarArrayProveedores(){
    await this.srvProveedor.getAll()
    .then(data => {
      this.Proveedores = data;
      
    })
  }

  onPagination(event: any) {
		this.primera_fila = event.first;
	}

  detallesOC(idComprasOC: number) {
   
		//this.ordencompra = oc;
    /////////////////////////////////////////////
    this.router.navigate(["recepcionproducto", idComprasOC]);
    //this.displayDialog = true;
		//this.tituloDialogo = "Detalles OC: ";
    
	}
}