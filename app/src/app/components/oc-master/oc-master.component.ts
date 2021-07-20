import { Component, Input, OnInit } from '@angular/core';
import { ProveedoresComprasService } from './../../services/proveedores-compras.service';
import { ProveedorModelo } from 'src/app/models/proveedor-modelo';
import { OrdenCompra } from './../../models/orden-compra';
import { OrdenCompraService } from './../../services/orden-compra.service';

@Component({
  selector: 'app-oc-master',
  templateUrl: './oc-master.component.html',
  styleUrls: ['./oc-master.component.scss']
})
export class OcMasterComponent implements OnInit {

  @Input() idOc: number = -1;
	ordenCompra: OrdenCompra = {};	
	datosProveedor: ProveedorModelo = {};	
  
  constructor(
    private svrOc: OrdenCompraService,     
		private svrProveedor: ProveedoresComprasService 
    ) { }

  ngOnInit(): void {

    this.cargaData();

  }

  async cargaData() {
		// console.log(this.idOc);
		this.ordenCompra = await this.svrOc.getOcOne(this.idOc).toPromise();		
		this.datosProveedor = await this.svrProveedor.getOne(this.ordenCompra.idProveedor).toPromise();		
	}

}
